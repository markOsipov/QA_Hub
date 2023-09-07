import {makeAutoObservable} from "mobx";
import {getCookie, QaHubCookies, setCookie} from "../utils/CookieHelper";
import {loadProjects} from "../requests/ProjectRequests";

class ProjectState {
    projects = getCookie(QaHubCookies.projects) || []                      //Project names only
    projectsDetails = []                                      //Projects full info.
    selectedProject = getCookie(QaHubCookies.selectedProject)       //Current project name

    setProjects(projects) {
        this.projects = projects
        setCookie(QaHubCookies.projects, projects)
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
        if (this.projects.includes(newProject)) {
            this.selectedProject = newProject
            if (newProject) {
                setCookie(QaHubCookies.selectedProject, newProject)
            }
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