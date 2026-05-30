import { getApiBaseUrl } from './api.js';

const contentRevalidateSeconds = Number(process.env.NEXT_PUBLIC_CONTENT_REVALIDATE_SECONDS || 300);

function getContentFetchOptions() {
    const normalizedRevalidateSeconds = Number.isFinite(contentRevalidateSeconds) && contentRevalidateSeconds >= 0
        ? contentRevalidateSeconds
        : 300;

    if (normalizedRevalidateSeconds === 0) {
        return {
            cache: 'no-store',
        };
    }

    return {
        next: { revalidate: normalizedRevalidateSeconds },
    };
}

async function fetchContentCollection(pathname, locale) {
    const url = new URL(pathname, getApiBaseUrl());

    if (locale) {
        url.searchParams.set('locale', locale);
    }

    const response = await fetch(url.toString(), getContentFetchOptions());

    const rawText = await response.text();
    let data = null;

    try {
        data = rawText ? JSON.parse(rawText) : null;
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(data?.message || rawText || `Failed to load content from ${pathname}.`);
    }

    return Array.isArray(data?.items) ? data.items : [];
}

export async function getProjects(locale) {
    return fetchContentCollection('/api/content/projects', locale);
}

export async function getMediaItems(locale) {
    return fetchContentCollection('/api/content/media', locale);
}

export async function getProjectStaticSlugs() {
    const items = await getProjects('en');

    return items
        .map((item) => item?.slug)
        .filter(Boolean);
}

export async function getMediaStaticSlugs() {
    const items = await getMediaItems('en');

    return items
        .map((item) => item?.slug)
        .filter(Boolean);
}
