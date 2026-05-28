const defaultAdminCallbackUrl = '/admin';

export function normalizeAdminCallbackUrl(value) {
    if (typeof value !== 'string' || !value.trim()) {
        return defaultAdminCallbackUrl;
    }

    try {
        const parsedUrl = new URL(value, 'https://artnation.local');
        const isSameOrigin = parsedUrl.origin === 'https://artnation.local';
        const isAdminPath = parsedUrl.pathname === '/admin' || parsedUrl.pathname.startsWith('/admin/');

        if (!isSameOrigin || !isAdminPath) {
            return defaultAdminCallbackUrl;
        }

        return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    } catch {
        return defaultAdminCallbackUrl;
    }
}
