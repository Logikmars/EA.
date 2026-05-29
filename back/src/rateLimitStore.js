import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

let cacheDirectoryPath = null;
let persistenceDisabled = false;

function getCandidateCacheDirectoryPaths() {
    const configuredPath = process.env.RATE_LIMIT_CACHE_DIR?.trim();

    return [
        configuredPath || null,
        path.join(process.cwd(), '.cache'),
        path.join(os.tmpdir(), 'artnation-back-cache'),
    ].filter(Boolean);
}

function resolveCacheDirectoryPath() {
    if (cacheDirectoryPath) {
        return cacheDirectoryPath;
    }

    for (const candidatePath of getCandidateCacheDirectoryPaths()) {
        try {
            if (!existsSync(candidatePath)) {
                mkdirSync(candidatePath, { recursive: true });
            }

            cacheDirectoryPath = candidatePath;
            return cacheDirectoryPath;
        } catch {
            continue;
        }
    }

    persistenceDisabled = true;
    return null;
}

function getRateLimitStorePath() {
    const resolvedCacheDirectoryPath = resolveCacheDirectoryPath();

    if (!resolvedCacheDirectoryPath) {
        return null;
    }

    return path.join(resolvedCacheDirectoryPath, 'rate-limit.json');
}

function ensureCacheDirectory() {
    const resolvedCacheDirectoryPath = resolveCacheDirectoryPath();

    if (!resolvedCacheDirectoryPath) {
        return false;
    }

    if (!existsSync(resolvedCacheDirectoryPath)) {
        mkdirSync(resolvedCacheDirectoryPath, { recursive: true });
    }

    return true;
}

function normalizeBuckets(rawBuckets) {
    const nextBuckets = new Map();

    if (!rawBuckets || typeof rawBuckets !== 'object') {
        return nextBuckets;
    }

    for (const [key, value] of Object.entries(rawBuckets)) {
        if (
            !value
            || typeof value !== 'object'
            || !Number.isFinite(value.count)
            || !Number.isFinite(value.resetAt)
        ) {
            continue;
        }

        nextBuckets.set(key, {
            count: Math.max(0, Math.floor(value.count)),
            resetAt: Math.max(0, Math.floor(value.resetAt)),
        });
    }

    return nextBuckets;
}

function loadBuckets() {
    if (!ensureCacheDirectory()) {
        return new Map();
    }

    const rateLimitStorePath = getRateLimitStorePath();

    try {
        const rawValue = readFileSync(rateLimitStorePath, 'utf8');
        const parsedValue = JSON.parse(rawValue);

        return normalizeBuckets(parsedValue?.buckets);
    } catch {
        return new Map();
    }
}

function persistBuckets(currentBuckets) {
    if (persistenceDisabled || !ensureCacheDirectory()) {
        return;
    }

    const rateLimitStorePath = getRateLimitStorePath();

    if (!rateLimitStorePath) {
        return;
    }

    const tempPath = `${rateLimitStorePath}.tmp`;
    const payload = JSON.stringify({
        buckets: Object.fromEntries(currentBuckets),
    });

    try {
        writeFileSync(tempPath, payload, 'utf8');
        renameSync(tempPath, rateLimitStorePath);
    } catch {
        persistenceDisabled = true;

        if (existsSync(tempPath)) {
            try {
                unlinkSync(tempPath);
            } catch {
                // Ignore cleanup errors and keep the in-memory limiter working.
            }
        }
    }
}

export function cleanupExpiredBuckets(now) {
    const currentBuckets = loadBuckets();
    const rateLimitStorePath = getRateLimitStorePath();
    let didChange = false;

    for (const [key, bucket] of currentBuckets.entries()) {
        if (bucket.resetAt <= now) {
            currentBuckets.delete(key);
            didChange = true;
        }
    }

    if (didChange) {
        if (!currentBuckets.size && rateLimitStorePath && existsSync(rateLimitStorePath)) {
            try {
                unlinkSync(rateLimitStorePath);
            } catch {
                persistenceDisabled = true;
            }
            return;
        }

        persistBuckets(currentBuckets);
    }
}

export function consumeBucket({ key, limit, windowMs, now }) {
    const currentBuckets = loadBuckets();
    const bucket = currentBuckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        currentBuckets.set(key, {
            count: 1,
            resetAt: now + windowMs,
        });
        persistBuckets(currentBuckets);

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
    currentBuckets.set(key, bucket);
    persistBuckets(currentBuckets);

    return {
        allowed: true,
        retryAfter: 0,
    };
}
