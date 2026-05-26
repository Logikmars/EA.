import { makeAutoObservable } from "mobx";

class ProjectsStore {
  projects = [
    {
      id: "national-multimedia-company",
      img: "/imgs/projects/1.png",
      title: "Національна мультимедійна компанія",
      description:
        "Створив дистрибуційну мережу з 4573 точок продажу ліцензійних компакт-дисків. У 2007 році досяг річного обігу 20 мільйонів $ США. Асортимент — понад 30 000 товарів.",
      alt: "Національна мультимедійна компанія",
    },
    {
      id: "art-nation",
      img: "/imgs/projects/1.png",
      title: "Art Nation",
      description:
        "Продано понад 255 мільйонів колекційних товарів. Співпрацює з найбільшими ритейлерами України та СНД. Річний обіг наших клієнтів складає понад 200 мільярдів грн.",
      alt: "Art Nation",
    },
    {
      id: "book-of-records-ukraine",
      img: "/imgs/projects/1.png",
      title: "Книга рекордів України",
      description:
        "Рекордсмен України з продажу дитячих книжок — 1 мільйон 241 тисяча проданих примірників у 2018 році.",
      alt: "Книга рекордів України",
      },
    {
      id: "book-of-records-moldova",
      img: "/imgs/projects/1.png",
      title: "Книга рекордів України",
      description:
        "Рекордсмен України з продажу дитячих книжок — 1 мільйон 241 тисяча проданих примірників у 2018 році.",
      alt: "Книга рекордів України",
    },
  ];

  selectedProjectId = null;
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  get featuredProjects() {
    return this.projects.slice(0, 3);
  }

  get selectedProject() {
    return (
      this.projects.find((project) => project.id === this.selectedProjectId) ||
      null
    );
  }

  setProjects(projects) {
    this.projects = projects;
  }

  addProject(project) {
    this.projects.push(project);
  }

  selectProject(projectId) {
    this.selectedProjectId = projectId;
  }

  clearSelectedProject() {
    this.selectedProjectId = null;
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
  }

  setError(error) {
    this.error = error;
  }
}

const projectsStore = new ProjectsStore();

export { ProjectsStore, projectsStore };
export default projectsStore;
