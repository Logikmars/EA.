import { makeAutoObservable } from 'mobx';

class ProjectsStore {
    projects = [
        {
            id: 'national-multimedia-company',
            img: '/imgs/projects/1.png',
        },
        {
            id: 'art-nation',
            img: '/imgs/projects/1.png',
        },
        {
            id: 'book-of-records-ukraine',
            img: '/imgs/projects/1.png',
        },
        {
            id: 'book-of-records-moldova',
            img: '/imgs/projects/1.png',
        },
    ];

    selectedProjectId = null;
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }
}

const projectsStore = new ProjectsStore();

export { ProjectsStore, projectsStore };
export default projectsStore;
