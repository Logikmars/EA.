import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { getSession } from '@auth/express';
import { verifySync } from 'otplib';
import { buildAdminUser, buildSessionPayload, normalizeEmail, normalizeOtp, normalizePassword } from './login-model.js';
import { verifyPassword } from '../../src/passwordHash.js';
import { createHttpError } from '../../src/httpError.js';
import { AdminLoginChallengeModel } from './login-challenge-model.js';

const challengeTtlMs = 5 * 60 * 1000;
const maxChallengeAttempts = 5;
const defaultTotpToleranceSeconds = 30;

function hashValue(value) {
    return createHash('sha256').update(String(value)).digest();
}

function safeCompare(left, right) {
    return timingSafeEqual(hashValue(left), hashValue(right));
}

function getAdminCredentials() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    return {
        adminEmail,
        adminPasswordHash,
    };
}

function isPrimaryAdminCredentialsValid(credentials) {
    const { adminEmail, adminPasswordHash } = getAdminCredentials();
    const email = normalizeEmail(credentials?.email);
    const password = normalizePassword(credentials?.password);

    if (!adminEmail || !adminPasswordHash || !email || !password) {
        return false;
    }

    const isValidEmail = safeCompare(email, normalizeEmail(adminEmail));
    const isValidPassword = verifyPassword(password, adminPasswordHash);

    return isValidEmail && isValidPassword;
}

function hashChallengeToken(token) {
    return createHash('sha256').update(String(token)).digest('hex');
}

function isTwoFactorEnabled() {
    return Boolean(process.env.ADMIN_2FA_SECRET);
}

function resolveTotpToleranceSeconds() {
    const rawValue = String(process.env.ADMIN_2FA_EPOCH_TOLERANCE_SECONDS ?? '').trim();

    if (!rawValue) {
        return defaultTotpToleranceSeconds;
    }

    const parsedValue = Number(rawValue);

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        return defaultTotpToleranceSeconds;
    }

    return Math.floor(parsedValue);
}

function verifyTotpCode(otp) {
    const secret = process.env.ADMIN_2FA_SECRET;

    if (!secret) {
        return true;
    }

    const normalizedOtp = normalizeOtp(otp);

    if (!normalizedOtp) {
        return false;
    }

    return Boolean(verifySync({
        token: normalizedOtp,
        secret,
        epochTolerance: resolveTotpToleranceSeconds(),
    })?.valid);
}

async function createAdminLoginChallenge(email) {
    const normalizedEmail = normalizeEmail(email);
    const challengeToken = randomBytes(32).toString('base64url');

    await AdminLoginChallengeModel.deleteMany({
        email: normalizedEmail,
        usedAt: null,
    });

    await AdminLoginChallengeModel.create({
        tokenHash: hashChallengeToken(challengeToken),
        email: normalizedEmail,
        expiresAt: new Date(Date.now() + challengeTtlMs),
    });

    return challengeToken;
}

async function consumeAdminLoginChallenge(challengeToken, otp) {
    const normalizedToken = String(challengeToken ?? '').trim();

    if (!normalizedToken) {
        return null;
    }

    const tokenHash = hashChallengeToken(normalizedToken);
    const challenge = await AdminLoginChallengeModel.findOne({
        tokenHash,
        usedAt: null,
        expiresAt: { $gt: new Date() },
        attempts: { $lt: maxChallengeAttempts },
    }).lean();

    if (!challenge) {
        return null;
    }

    if (!verifyTotpCode(otp)) {
        await AdminLoginChallengeModel.updateOne(
            {
                _id: challenge._id,
                usedAt: null,
            },
            {
                $inc: { attempts: 1 },
            },
        );

        return null;
    }

    const consumedChallenge = await AdminLoginChallengeModel.findOneAndUpdate(
        {
            _id: challenge._id,
            usedAt: null,
            expiresAt: { $gt: new Date() },
            attempts: { $lt: maxChallengeAttempts },
        },
        {
            $set: {
                usedAt: new Date(),
            },
        },
        {
            new: true,
        },
    ).lean();

    if (!consumedChallenge) {
        return null;
    }

    return consumedChallenge;
}

export async function initiateAdminLogin(credentials) {
    const { adminEmail } = getAdminCredentials();

    if (!isPrimaryAdminCredentialsValid(credentials) || !adminEmail) {
        return null;
    }

    if (!isTwoFactorEnabled()) {
        return {
            requiresTwoFactor: false,
        };
    }

    return {
        requiresTwoFactor: true,
        challengeToken: await createAdminLoginChallenge(adminEmail),
    };
}

export async function authorizeAdmin(credentials) {
    const { adminEmail } = getAdminCredentials();

    if (isTwoFactorEnabled()) {
        const challenge = await consumeAdminLoginChallenge(credentials?.challengeToken, credentials?.otp);

        if (!challenge?.email || !adminEmail || !safeCompare(challenge.email, normalizeEmail(adminEmail))) {
            return null;
        }

        return buildAdminUser(adminEmail);
    }

    if (!isPrimaryAdminCredentialsValid(credentials) || !adminEmail) {
        return null;
    }

    return buildAdminUser(adminEmail);
}

export async function getAdminSession(req, authConfig) {
    return getSession(req, authConfig);
}

export async function ensureAdminSession(req, authConfig) {
    const session = await getAdminSession(req, authConfig);

    if (!session?.user) {
        throw createHttpError(401, 'Unauthorized');
    }

    return session;
}

export function mapSessionResponse(session) {
    return buildSessionPayload(session);
}
