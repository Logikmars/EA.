import { getApiBaseUrl } from './api';

function isAbsoluteUrl(value) {
    return /^https?:\/\//i.test(value);
}

export function isManagedUploadPath(value) {
    return typeof value === 'string' && value.startsWith('/uploads/');
}

export function isManagedUploadUrl(value) {
    if (!isAbsoluteUrl(value)) {
        return false;
    }

    try {
        return new URL(value).pathname.startsWith('/uploads/');
    } catch {
        return false;
    }
}

export function resolveImageUrl(value) {
    if (typeof value !== 'string' || !value.trim()) {
        return value;
    }

    const normalizedValue = value.trim();

    if (isManagedUploadPath(normalizedValue)) {
        return `${getApiBaseUrl()}${normalizedValue}`;
    }

    return normalizedValue;
}
