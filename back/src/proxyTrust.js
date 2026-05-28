function parseNumericTrustProxy(value) {
    if (!/^\d+$/.test(value)) {
        return null;
    }

    return Number(value);
}

export function resolveTrustProxySetting(rawValue = process.env.TRUST_PROXY) {
    if (typeof rawValue !== 'string') {
        return false;
    }

    const normalizedValue = rawValue.trim().toLowerCase();

    if (!normalizedValue || normalizedValue === 'false' || normalizedValue === '0') {
        return false;
    }

    if (normalizedValue === 'true') {
        return true;
    }

    const numericValue = parseNumericTrustProxy(normalizedValue);

    if (numericValue !== null) {
        return numericValue;
    }

    if (['loopback', 'linklocal', 'uniquelocal'].includes(normalizedValue)) {
        return normalizedValue;
    }

    return false;
}
