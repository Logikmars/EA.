import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ExpressAuth } from '@auth/express';
import { authConfig, requireAdmin } from './auth.js';
import { createLoginRouter } from '../components/login/login-router.js';
import { createProjectsRouter } from '../components/projects/projects-router.js';
import { createMediaRouter } from '../components/media/media-router.js';
import { connectDatabase } from './db.js';
import { createRateLimit } from './rateLimit.js';
import { uploadsDirectoryPath } from './paths.js';
import { resolveTrustProxySetting } from './proxyTrust.js';
import { isHttpError } from './httpError.js';
import { validateR2Config } from './r2.js';

const port = Number(process.env.PORT || 5000);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const isDevelopment = process.env.NODE_ENV !== 'production';
const app = express();
const authRateLimit = createRateLimit({
    limit: 10,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'auth',
    message: 'Too many authentication attempts. Please try again later.',
});
const apiRateLimit = createRateLimit({
    limit: 300,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'api',
    message: 'Too many API requests. Please try again later.',
});

app.set('trust proxy', resolveTrustProxySetting());

app.use(cors({
    origin: frontendUrl,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
// Legacy support for existing MongoDB records that still point to /uploads/*.
// New uploads are stored exclusively in Cloudflare R2.
app.use('/uploads', express.static(uploadsDirectoryPath));

app.use('/api', apiRateLimit);
if (!isDevelopment) {
    app.use(/^\/auth(\/.*)?$/, authRateLimit);
}
app.use(/^\/auth(\/.*)?$/, ExpressAuth(authConfig));

app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
    });
});
app.use('/api/admin', createLoginRouter(authConfig, requireAdmin));
app.use('/api', createProjectsRouter(requireAdmin));
app.use('/api', createMediaRouter(requireAdmin));

app.use('/api', (req, res) => {
    res.status(404).json({
        message: `API route not found: ${req.method} ${req.originalUrl}`,
    });
});

app.use((error, req, res, next) => {
    if (error?.name === 'ZodError') {
        return res.status(400).json({
            message: 'Validation failed.',
            issues: error.issues,
        });
    }

    if (error?.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            message: 'Image file must be 8 MB or smaller.',
        });
    }

    if (isHttpError(error)) {
        return res.status(error.statusCode).json({
            message: error.expose ? error.message : 'Internal server error.',
        });
    }

    if (error instanceof Error) {
        console.error('Unhandled backend error:', error);
    }

    return res.status(500).json({
        message: 'Internal server error.',
    });
});

async function bootstrap() {
    validateR2Config();
    await connectDatabase();

    app.listen(port, () => {
        console.log(`listening on http://localhost:${port}`);
    });
}

bootstrap().catch((error) => {
    console.error('Failed to start backend:', error);
    process.exit(1);
});
