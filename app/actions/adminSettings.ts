"use server";

/** Read-only public settings. Production CMS access is intentionally excluded. */
export async function getSiteSettings(): Promise<Record<string, any>> {
    return {
        maintenance_mode: false,
        active_event: "none",
        home_topics: [],
    };
}
