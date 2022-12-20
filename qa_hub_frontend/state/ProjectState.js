import {makeAutoObservable} from "mobx";

class ProjectState {
    projects = []
    selectedProject = this.projects[0]

    setProjects(projects) {
        this.projects = projects
    }

    setSelectedProject(newProject) {
        this.selectedProject = newProject
    }

    constructor() {
        makeAutoObservable(this)
    }
}

export default new ProjectState()