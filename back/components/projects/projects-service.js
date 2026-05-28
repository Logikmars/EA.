import { appendProject, deleteProjectBySlug, readAdminContent, updateProjectBySlug } from '../../src/contentStore.js';
import { mapProjectListItem, projectSchema } from './projects-model.js';

class ProjectsService {
    getLocale(value) {
        return value === 'en' ? 'en' : 'ua';
    }

    async getPublicProjects(localeQuery) {
        const locale = this.getLocale(localeQuery);
        const content = await readAdminContent();

        return content.projects.map((project) => mapProjectListItem(project, locale));
    }

    async getAdminProjects() {
        const content = await readAdminContent();

        return content.projects;
    }

    async createProject(payload) {
        const parsedPayload = projectSchema.parse(payload);

        return appendProject(parsedPayload);
    }

    async updateProject(slug, payload) {
        const parsedPayload = projectSchema.parse(payload);

        return updateProjectBySlug(slug, parsedPayload);
    }

    async deleteProject(slug) {
        return deleteProjectBySlug(slug);
    }
}

export const projectsService = new ProjectsService();
export default projectsService;
