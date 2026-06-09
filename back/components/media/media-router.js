import { Router } from 'express';
import mediaController from './media-controller.js';
import { createRateLimit } from '../../src/rateLimit.js';

export function createMediaRouter(requireAdmin) {
    const router = Router();
    const adminWriteRateLimit = createRateLimit({
        limit: 60,
        windowMs: 15 * 60 * 1000,
        keyPrefix: 'admin-media-write',
        message: 'Too many media changes. Please try again later.',
    });

    router.get('/content/media', mediaController.getPublicMedia);
    router.post('/admin/media', requireAdmin, adminWriteRateLimit, mediaController.createMedia);
    router.put('/admin/media/by-source/:sourceUrl', requireAdmin, adminWriteRateLimit, mediaController.updateMedia);
    router.delete('/admin/media/by-source/:sourceUrl', requireAdmin, adminWriteRateLimit, mediaController.deleteMedia);

    return router;
}
