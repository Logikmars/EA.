const buckets = new Map();
const trustedProxyIpHeaderNames = (process.env.TRUSTED_PROXY_IP_HEADERS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
const fallbackClientKeyHeaderNames = ['x-forwarded-host', 'host'];

function cleanupExpiredBuckets(now) {
    for (const [key, bucket] of buckets.entries()) {
        if (bucket.resetAt <= now) {
            buckets.delete(key);
        }
    }
}

function getClientIp(request) {
    for (const headerName of trustedProxyIpHeaderNames) {
        const headerValue = request.headers.get(headerName);

        if (!headerValue) {
            continue;
        }

        return headerValue.split(',')[0].trim();
    }

    for (const headerName of fallbackClientKeyHeaderNames) {
        const headerValue = request.headers.get(headerName);

        if (!headerValue) {
            continue;
        }

        return `origin:${headerValue.trim().toLowerCase()}`;
    }

    const origin = request.headers.get('origin');

    if (origin) {
        return `origin:${origin.trim().toLowerCase()}`;
    }

    return 'anonymous';
}

export function consumeRateLimit({
    request,
    limit,
    windowMs,
    keyPrefix,
}) {
    const now = Date.now();

    cleanupExpiredBuckets(now);

    const key = `${keyPrefix}:${getClientIp(request)}`;
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, {
            count: 1,
            resetAt: now + windowMs,
        });

        return {
            allowed: true,
            retryAfter: 0,
        };
    }

    if (bucket.count >= limit) {
        return {
            allowed: false,
            retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        };
    }

    bucket.count += 1;

    return {
        allowed: true,
        retryAfter: 0,
    };
}
