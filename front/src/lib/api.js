const fallbackApiUrl = 'http://localhost:5000';
export const jsonHeaders = {
    'Content-Type': 'application/json',
};
export const authFormHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Auth-Return-Redirect': '1',
};

export function getApiBaseUrl() {
    return (process.env.NEXT_PUBLIC_API_URL || fallbackApiUrl).replace(/\/$/, '');
}

export function getAuthBaseUrl() {
    return `${getApiBaseUrl()}/auth`;
}

export function buildApiUrl(pathname = '') {
    return `${getApiBaseUrl()}${pathname}`;
}

export function buildAuthUrl(pathname = '') {
    return `${getAuthBaseUrl()}${pathname}`;
}

export async function requestJson(url, options = {}) {
    const response = await fetch(url, options);
    const rawText = await response.text();
    let data = null;

    try {
        data = rawText ? JSON.parse(rawText) : null;
    } catch {
        data = null;
    }

    if (!response.ok) {
        const message = data?.message || rawText || 'Request failed.';
        const error = new Error(message);
        error.status = response.status;
        error.payload = data;
        throw error;
    }

    return data;
}

export function requestApi(pathname, options = {}) {
    return requestJson(buildApiUrl(pathname), options);
}

export function requestAuth(pathname, options = {}) {
    return requestJson(buildAuthUrl(pathname), options);
}

export function requestAdmin(pathname, options = {}) {
    const { headers, ...restOptions } = options;

    return requestApi(`/api/admin${pathname}`, {
        credentials: 'include',
        ...restOptions,
        ...(headers ? { headers } : {}),
    });
}

export function requestAdminJson(pathname, { body, headers, ...options } = {}) {
    return requestAdmin(pathname, {
        ...options,
        headers: {
            ...jsonHeaders,
            ...(headers || {}),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
}

export async function getCsrfToken() {
    const data = await requestAuth('/csrf', {
        credentials: 'include',
    });

    return data?.csrfToken || '';
}
