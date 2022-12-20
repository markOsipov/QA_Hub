import {makeAutoObservable} from "mobx";
import {getCookie, setCookie} from "../utils/CookieHelper";

class ProjectState {
    projects = getCookie("projects") ?? []
    selectedProject = getCookie("selected-project")

    setProjects(projects) {
        this.projects = projects
        setCookie("projects", projects)
    }

    setSelectedProject(newProject) {
        this.selectedProject = newProject
        setCookie("selected-project",newProject)
    }

    constructor() {
        makeAutoObservable(this)
    }
}

export default new ProjectState()