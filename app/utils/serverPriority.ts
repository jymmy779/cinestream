import type { EpisodeServer } from "@/app/types/movie";

export function getQualityPriority(quality?: string | null): number {
    const normalized = (quality || "").trim().toUpperCase();
    const kMatch = normalized.match(/(\d+(?:\.\d+)?)\s*K\b/);

    if (kMatch) {
        const kValue = Number(kMatch[1]);
        if (Number.isFinite(kValue) && kValue >= 2) return 1_000 + kValue;
    }

    const resolutionMatch = normalized.match(/(\d{3,4})\s*P\b/);
    if (resolutionMatch) {
        const resolution = Number(resolutionMatch[1]);
        if (resolution >= 1440) return 900 + resolution;
        if (resolution >= 1080) return 400;
        if (resolution >= 720) return 300;
    }

    if (normalized.includes("FULL HD") || normalized.includes("FULLHD") || normalized.includes("FHD")) return 400;
    if (normalized.includes("HD")) return 300;
    if (normalized.includes("SD")) return 200;
    if (normalized.includes("CAM")) return 100;
    return 0;
}

export function isPremiumQuality(quality?: string | null): boolean {
    return getQualityPriority(quality) >= 1_000;
}

export function extractMaxEpisodeNumber(server: EpisodeServer): number {
    if (!Array.isArray(server.server_data) || server.server_data.length === 0) return 0;

    let maxEpisode = 0;
    for (const episode of server.server_data) {
        const matches = `${episode.name || ""} ${episode.slug || ""}`.match(/\d+/g);
        if (!matches) continue;

        for (const match of matches) {
            const episodeNumber = Number.parseInt(match, 10);
            if (episodeNumber > maxEpisode && episodeNumber < 100_000) maxEpisode = episodeNumber;
        }
    }

    return maxEpisode > 0 ? maxEpisode : server.server_data.length;
}

function getSourcePriority(serverName?: string | null): number {
    const normalized = (serverName || "").toUpperCase();
    if (normalized.includes("ĐỘC QUYỀN") || normalized.includes("EXCLUSIVE") || normalized.includes("SONG NGỮ")) return 100;
    if (normalized.includes(" KK")) return 80;
    if (normalized.includes(" NC")) return 60;
    if (normalized.includes(" VS")) return 40;
    if (normalized.includes(" OP")) return 20;
    return 50;
}

function getLanguagePriority(serverName?: string | null): number {
    return (serverName || "").toUpperCase().includes("VIETSUB") ? 1 : 0;
}

export function sortEpisodeServers<T extends EpisodeServer>(servers: T[], isSeriesOngoing: boolean): T[] {
    return [...servers].sort((first, second) => {
        if (isSeriesOngoing) {
            const episodeDifference = extractMaxEpisodeNumber(second) - extractMaxEpisodeNumber(first);
            if (episodeDifference !== 0) return episodeDifference;
        }

        const qualityDifference = getQualityPriority(second.quality || second.server_name) - getQualityPriority(first.quality || first.server_name);
        if (qualityDifference !== 0) return qualityDifference;

        const languageDifference = getLanguagePriority(second.server_name) - getLanguagePriority(first.server_name);
        if (languageDifference !== 0) return languageDifference;

        const firstHasM3u8 = first.server_data.some((episode) => Boolean(episode.link_m3u8?.trim())) ? 1 : 0;
        const secondHasM3u8 = second.server_data.some((episode) => Boolean(episode.link_m3u8?.trim())) ? 1 : 0;
        if (secondHasM3u8 !== firstHasM3u8) return secondHasM3u8 - firstHasM3u8;

        const sourceDifference = getSourcePriority(second.server_name) - getSourcePriority(first.server_name);
        if (sourceDifference !== 0) return sourceDifference;

        return first.server_name.localeCompare(second.server_name, "vi");
    });
}
