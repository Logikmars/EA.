export const cookieConsentCookieName = 'ea_cookie_consent';
export const cookieConsentVersion = '1';
export const cookieConsentMaxAgeSeconds = 60 * 60 * 24 * 365;

export const defaultCookieConsent = {
    necessary: true,
    analytics: false,
    marketing: false,
};

function normalizeConsentValue(value, fallback) {
    if (typeof value === 'boolean') {
        return value;
    }

    return fallback;
}

export function normalizeCookieConsent(value) {
    if (!value || typeof value !== 'object') {
        return {
            ...defaultCookieConsent,
        };
    }

    return {
        necessary: true,
        analytics: normalizeConsentValue(value.analytics, false),
        marketing: normalizeConsentValue(value.marketing, false),
    };
}

export function serializeCookieConsent(value) {
    const normalized = normalizeCookieConsent(value);

    return JSON.stringify({
        v: cookieConsentVersion,
        consent: normalized,
    });
}

export function parseCookieConsent(rawValue) {
    if (!rawValue) {
        return null;
    }

    try {
        const parsedValue = JSON.parse(rawValue);

        if (parsedValue?.v !== cookieConsentVersion) {
            return null;
        }

        return normalizeCookieConsent(parsedValue.consent);
    } catch {
        return null;
    }
}

export function readCookieValue(name) {
    if (typeof document === 'undefined') {
        return '';
    }

    const cookies = document.cookie ? document.cookie.split('; ') : [];
    const cookiePrefix = `${name}=`;
    const matchedCookie = cookies.find((cookie) => cookie.startsWith(cookiePrefix));

    if (!matchedCookie) {
        return '';
    }

    return decodeURIComponent(matchedCookie.slice(cookiePrefix.length));
}

export function writeCookieValue(name, value, maxAge = cookieConsentMaxAgeSeconds) {
    if (typeof document === 'undefined') {
        return;
    }

    document.cookie = [
        `${name}=${encodeURIComponent(value)}`,
        'Path=/',
        `Max-Age=${maxAge}`,
        'SameSite=Lax',
    ].join('; ');
}

export function readStoredCookieConsent() {
    return parseCookieConsent(readCookieValue(cookieConsentCookieName));
}

export function storeCookieConsent(value) {
    writeCookieValue(cookieConsentCookieName, serializeCookieConsent(value));
}
