const buckets = new Map();

function cleanupExpiredBuckets(now) {
    for (const [key, bucket] of buckets.entries()) {
        if (bucket.resetAt <= now) {
            buckets.delete(key);
        }
    }
}

function getClientIp(req) {
    return req.ip || req.socket?.remoteAddress || 'unknown';
}

export function createRateLimit({
    limit,
    windowMs,
    keyPrefix = 'global',
    message = 'Too many requests. Please try again later.',
} = {}) {
    if (!Number.isFinite(limit) || limit <= 0) {
        throw new Error('Rate limit "limit" must be a positive number.');
    }

    if (!Number.isFinite(windowMs) || windowMs <= 0) {
        throw new Error('Rate limit "windowMs" must be a positive number.');
    }

    return function rateLimitMiddleware(req, res, next) {
        const now = Date.now();

        cleanupExpiredBuckets(now);

        const key = `${keyPrefix}:${getClientIp(req)}`;
        const currentBucket = buckets.get(key);

        if (!currentBucket || currentBucket.resetAt <= now) {
            buckets.set(key, {
                count: 1,
                resetAt: now + windowMs,
            });

            return next();
        }

        if (currentBucket.count >= limit) {
            const retryAfterSeconds = Math.max(1, Math.ceil((currentBucket.resetAt - now) / 1000));

            res.set('Retry-After', String(retryAfterSeconds));

            return res.status(429).json({
                message,
            });
        }

        currentBucket.count += 1;
        return next();
    };
}
