import { cleanupExpiredBuckets, consumeBucket } from './rateLimitStore.js';

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
        const result = consumeBucket({
            key,
            limit,
            now,
            windowMs,
        });

        if (!result.allowed) {
            res.set('Retry-After', String(result.retryAfter));

            return res.status(429).json({
                message,
            });
        }

        return next();
    };
}
