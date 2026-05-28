import { Router } from 'express';
import projectsController from './projects-controller.js';

export function createProjectsRouter(requireAdmin) {
    const router = Router();

    router.get('/content/projects', projectsController.getPublicProjects);
    router.post('/admin/projects', requireAdmin, projectsController.createProject);
    router.put('/admin/projects/:slug', requireAdmin, projectsController.updateProject);
    router.delete('/admin/projects/:slug', requireAdmin, projectsController.deleteProject);

    return router;
}
