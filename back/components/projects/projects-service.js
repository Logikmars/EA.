import { appendProject, deleteProjectByHref, readAdminContent, updateProjectByHref } from '../../src/contentStore.js';
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

    async updateProject(href, payload) {
        const parsedPayload = projectSchema.parse(payload);

        return updateProjectByHref(href, parsedPayload);
    }

    async deleteProject(href) {
        return deleteProjectByHref(href);
    }
}

export const projectsService = new ProjectsService();
export default projectsService;
