import {makeAutoObservable} from "mobx";

class ProjectState {
    projects = ["wallet-client-ios", "wallet-client-android"]
    selectedProject = this.projects[0]

    setSelectedProject(newProject) {
        this.selectedProject = newProject
    }

    constructor() {
        makeAutoObservable(this)
    }
}

export default new ProjectState()