import { Router } from 'express';
import mediaController from './media-controller.js';

export function createMediaRouter(requireAdmin) {
    const router = Router();

    router.get('/content/media', mediaController.getPublicMedia);
    router.post('/admin/media', requireAdmin, mediaController.createMedia);
    router.put('/admin/media/:slug', requireAdmin, mediaController.updateMedia);
    router.delete('/admin/media/:slug', requireAdmin, mediaController.deleteMedia);

    return router;
}
