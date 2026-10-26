export function getYoutubeVideoId(value: unknown): string {
    if (typeof value !== 'string') return '';
    const text = value.trim();
    const valid = /^[a-zA-Z0-9_-]{11}$/;
    if (valid.test(text)) return text;
    try {
        const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
        const host = url.hostname.toLowerCase();
        const parts = url.pathname.split('/').filter(Boolean);
        let id = '';
        if (host === 'youtu.be') id = parts[0] || '';
        else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
            if (parts[0] === 'watch') id = url.searchParams.get('v') || '';
            else if (['shorts', 'embed', 'live'].includes(parts[0])) id = parts[1] || '';
        }
        return valid.test(id) ? id : '';
    } catch { return ''; }
}

export type FeedVideo = { id: string; title: string; isShort: boolean };

export function shuffleShorts(videos: FeedVideo[], previousFirst: string | null, random = Math.random): FeedVideo[] {
    const result = videos.filter(video => video.isShort);
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    if (result.length > 1 && result[0].id === previousFirst) {
        const next = 1 + Math.floor(random() * (result.length - 1));
        [result[0], result[next]] = [result[next], result[0]];
    }
    return result;
}

export function normalizeVideoFeed(data: unknown): FeedVideo[] {
    if (!Array.isArray(data)) throw new Error('Invalid video list');
    const seen = new Set<string>();
    return data.flatMap(item => {
        const id = getYoutubeVideoId(item?.video_url);
        if (!id || seen.has(id)) return [];
        seen.add(id);
        return [{ id, title: typeof item.video_title === 'string' && item.video_title.trim()
            ? item.video_title.trim() : 'Video từ Nha khoa Thùy Anh',
            isShort: /\/shorts\//i.test(item.video_url) }];
    });
}

export function normalizeVideoProgress(value: unknown): Record<string, number> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([id, seconds]) =>
        /^[a-zA-Z0-9_-]{11}$/.test(id) && typeof seconds === 'number' && Number.isFinite(seconds) && seconds >= 0)
        .slice(-100));
}
