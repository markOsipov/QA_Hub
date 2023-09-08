import {makeAutoObservable} from "mobx";
import {getCookie, QaHubCookies, setCookie} from "../utils/CookieHelper";
import {loadProjects} from "../requests/ProjectRequests";

class AppState {
  title = "QA Hub"

  setTitle(value) {
    this.title = value || "QA Hub"
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new AppState()