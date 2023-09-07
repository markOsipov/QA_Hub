import {makeAutoObservable} from "mobx";

class ProjectIntegrationsState {
  tmsInt = {}
  cicdInt =  {}
  taskTrackerInt  = {}

  setTmsInt(tmsInfo) {
    this.tmsInt = tmsInfo
  }

  setCicdInt(cicdInfo) {
    this.cicdInt = cicdInfo
  }

  setTaskTrackerInt(taskTrackerInfo) {
    this.taskTrackerInt = taskTrackerInfo
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new ProjectIntegrationsState()