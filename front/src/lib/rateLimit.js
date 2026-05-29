import { cleanupExpiredBuckets, consumeBucket } from './serverRateLimitStore.js';

const trustedProxyIpHeaderNames = (process.env.TRUSTED_PROXY_IP_HEADERS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

export function getRateLimitClientKey(request, fallbackKey = 'anonymous:unknown') {
    for (const headerName of trustedProxyIpHeaderNames) {
        const headerValue = request.headers.get(headerName);

        if (!headerValue) {
            continue;
        }

        return headerValue.split(',')[0].trim();
    }

    const forwardedFor = request.headers.get('x-forwarded-for');

    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');

    if (realIp) {
        return realIp.trim();
    }

    return fallbackKey;
}

export function consumeRateLimit({
    request,
    limit,
    windowMs,
    keyPrefix,
    fallbackKey,
}) {
    const now = Date.now();

    cleanupExpiredBuckets(now);

    const key = `${keyPrefix}:${getRateLimitClientKey(request, fallbackKey)}`;
    return consumeBucket({
        key,
        limit,
        now,
        windowMs,
    });
}
