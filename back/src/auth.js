import Credentials from '@auth/express/providers/credentials';
import { authorizeAdmin, ensureAdminSession } from '../components/login/login-service.js';
import { isHttpError } from './httpError.js';

function resolveAuthCookieSameSite() {
    const rawValue = String(process.env.AUTH_COOKIE_SAME_SITE ?? '').trim().toLowerCase();

    if (rawValue === 'strict' || rawValue === 'lax' || rawValue === 'none') {
        return rawValue;
    }

    return 'lax';
}

function buildCookieOptions() {
    const sameSite = resolveAuthCookieSameSite();
    const secure = process.env.NODE_ENV === 'production' || sameSite === 'none';

    return {
        httpOnly: true,
        sameSite,
        path: '/',
        secure,
    };
}

const authCookieOptions = buildCookieOptions();

export const authConfig = {
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    useSecureCookies: authCookieOptions.secure,
    session: {
        strategy: 'jwt',
    },
    cookies: {
        sessionToken: {
            options: authCookieOptions,
        },
        callbackUrl: {
            options: authCookieOptions,
        },
        csrfToken: {
            options: authCookieOptions,
        },
        pkceCodeVerifier: {
            options: {
                ...authCookieOptions,
                maxAge: 60 * 15,
            },
        },
        state: {
            options: {
                ...authCookieOptions,
                maxAge: 60 * 15,
            },
        },
        nonce: {
            options: authCookieOptions,
        },
        webauthnChallenge: {
            options: {
                ...authCookieOptions,
                maxAge: 60 * 15,
            },
        },
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                otp: { label: 'One-time code', type: 'text' },
                challengeToken: { label: 'Challenge token', type: 'text' },
            },
            authorize(credentials) {
                return authorizeAdmin(credentials);
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user?.role) {
                token.role = user.role;
            }

            return token;
        },
        session({ session, token }) {
            if (session.user && token.role) {
                session.user.role = token.role;
            }

            return session;
        },
    },
};

export async function requireAdmin(req, res, next) {
    try {
        const session = await ensureAdminSession(req, authConfig);

        req.session = session;
        next();
    } catch (error) {
        const statusCode = isHttpError(error) ? error.statusCode : 500;
        const message = isHttpError(error) && error.expose
            ? error.message
            : 'Internal server error.';

        if (!isHttpError(error)) {
            console.error('Admin session check failed:', error);
        }

        res.status(statusCode).json({
            message,
        });
    }
}
