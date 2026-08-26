/**
 * Site Domain & URL Configuration
 * Sử dụng duy nhất biến môi trường NEXT_PUBLIC_SITE_URL làm nguồn chuẩn.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

/**
 * Tự động lấy hostname không chứa protocol hay www.
 */
export const SITE_DOMAIN = ((): string => {
    try {
        return new URL(SITE_URL).hostname.replace(/^www\./, '');
    } catch {
        return 'localhost';
    }
})();

/**
 * Helper tạo URL tuyệt đối cho bất kỳ đường dẫn nào:
 * getAbsoluteUrl('/phim/movie-slug') -> an absolute showcase URL
 */
export function getAbsoluteUrl(path: string = ''): string {
    if (!path) return SITE_URL;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${SITE_URL}${cleanPath}`;
}
