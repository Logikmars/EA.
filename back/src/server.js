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
import path from 'node:path';

const port = Number(process.env.PORT || 5000);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const app = express();

app.set('trust proxy', true);

app.use(cors({
    origin: frontendUrl,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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

    if (error instanceof Error) {
        return res.status(400).json({
            message: error.message,
        });
    }

    return res.status(500).json({
        message: 'Internal server error.',
    });
});

async function bootstrap() {
    await connectDatabase();

    app.listen(port, () => {
        console.log(`listening on http://localhost:${port}`);
    });
}

bootstrap().catch((error) => {
    console.error('Failed to start backend:', error);
    process.exit(1);
});
