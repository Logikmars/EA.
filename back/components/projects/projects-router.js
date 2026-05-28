import { Router } from 'express';
import projectsController from './projects-controller.js';
import { createRateLimit } from '../../src/rateLimit.js';

export function createProjectsRouter(requireAdmin) {
    const router = Router();
    const adminWriteRateLimit = createRateLimit({
        limit: 60,
        windowMs: 15 * 60 * 1000,
        keyPrefix: 'admin-project-write',
        message: 'Too many project changes. Please try again later.',
    });

    router.get('/content/projects', projectsController.getPublicProjects);
    router.post('/admin/projects', requireAdmin, adminWriteRateLimit, projectsController.createProject);
    router.put('/admin/projects/:slug', requireAdmin, adminWriteRateLimit, projectsController.updateProject);
    router.delete('/admin/projects/:slug', requireAdmin, adminWriteRateLimit, projectsController.deleteProject);

    return router;
}
