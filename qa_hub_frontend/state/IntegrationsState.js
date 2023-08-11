import {makeAutoObservable} from "mobx";

class IntegrationsState {
  tmsIntegrations = []
  tmsTypes = []

  cicdIntegrations = []
  cicdTypes = []

  taskTrackerIntegrations = []
  taskTrackerTypes = []

  setTmsIntegrations(integrations) {
    this.tmsIntegrations = integrations
  }

  setCicdIntegrations(integrations) {
    this.cicdIntegrations = integrations
  }

  setTaskTrackerIntegrations(integrations) {
    this.taskTrackerIntegrations = integrations
  }

  setTmsTypes(types) {
    this.tmsTypes = types
  }

  setCicdTypes(types) {
    this.cicdTypes = types
  }

  setTaskTrackerTypes(types) {
    this.taskTrackerTypes = types
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new IntegrationsState()