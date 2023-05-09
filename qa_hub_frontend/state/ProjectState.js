import {makeAutoObservable} from "mobx";
import {getCookie, setCookie} from "../utils/CookieHelper";
import {loadProjects} from "../requests/ProjectRequests";

class ProjectState {
    projects = getCookie("projects")                      //Project names only
    projectsDetails = []                                //Projects full info.
    selectedProject = getCookie("selected-project")       //Current project name

    setProjects(projects) {
        this.projects = projects
        setCookie("projects", projects)
    }

    updateProjects() {
        loadProjects().then((data) => {
            const newProjects = data.data.map(project => {
                return project.name
            })
            this.setProjects(newProjects)
            this.setProjectsDetails(data.data)
        })
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
                return project.name === this.selectedProject.selectedProject
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

    getSelectedProjectFullInfo() {
        return this.projectsDetails.find(project => {
            return project.name === this.selectedProject
        })
    }

    constructor() {
        makeAutoObservable(this)
    }
}

export default new ProjectState()