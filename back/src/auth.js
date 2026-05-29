import Credentials from '@auth/express/providers/credentials';
import { authorizeAdmin, ensureAdminSession } from '../components/login/login-service.js';
import { isHttpError } from './httpError.js';

export const authConfig = {
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    session: {
        strategy: 'jwt',
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
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
