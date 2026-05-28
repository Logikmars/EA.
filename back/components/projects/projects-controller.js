import projectsService from './projects-service.js';

class ProjectsController {
    getPublicProjects = async (req, res, next) => {
        try {
            const items = await projectsService.getPublicProjects(req.query.locale);

            return res.json({ items });
        } catch (error) {
            return next(error);
        }
    };

    createProject = async (req, res, next) => {
        try {
            const items = await projectsService.createProject(req.body);

            return res.status(201).json({ items });
        } catch (error) {
            return next(error);
        }
    };

    updateProject = async (req, res, next) => {
        try {
            const items = await projectsService.updateProject(req.params.slug, req.body);

            return res.json({ items });
        } catch (error) {
            return next(error);
        }
    };

    deleteProject = async (req, res, next) => {
        try {
            const items = await projectsService.deleteProject(req.params.slug);

            return res.json({ items });
        } catch (error) {
            return next(error);
        }
    };
}

export const projectsController = new ProjectsController();
export default projectsController;
