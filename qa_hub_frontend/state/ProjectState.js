import {makeAutoObservable} from "mobx";
import {getCookie, setCookie} from "../utils/CookieHelper";

class ProjectState {
    projects = getCookie("projects")                   //Project names only
    projectsDetails = []                                    //Projects full info.
    selectedProject = getCookie("selected-project")    //Current project name

    setProjects(projects) {
        this.projects = projects
        setCookie("projects", projects)
    }

    setProjectsDetails(projects) {
        this.projectsDetails = projects
    }

    setSelectedProject(newProject) {
        this.selectedProject = newProject
        if (newProject) {
            setCookie("selected-project", newProject)
        }
    }

    getSeparator() {
        try {
            return this.projectsDetails.find(project => {
                return project.name === selectedProject.selectedProject
            }).separator
        } catch (e) {
            return "."
        }
    }

    getSeparator(projectName) {
        try {
            return this.projectsDetails.find(project => {
                return project.name === projectName
            }).separator
        } catch (e) {
            return "."
        }
    }

    constructor() {
        makeAutoObservable(this)
    }
}

export default new ProjectState()