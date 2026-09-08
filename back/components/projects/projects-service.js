import { appendProject, deleteProjectById, readAdminContent, updateProjectById } from '../../src/contentStore.js';
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

    async updateProject(id, payload) {
        const parsedPayload = projectSchema.parse(payload);

        return updateProjectById(id, parsedPayload);
    }

    async deleteProject(id) {
        return deleteProjectById(id);
    }
}

export const projectsService = new ProjectsService();
export default projectsService;
