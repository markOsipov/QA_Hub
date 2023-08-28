import {makeAutoObservable} from "mobx";

class AlertState {
  alerts = []

  showAlert(title, severity) {
    this.alerts.push({ title: title, severity: severity || 'info' })
  }

  setAlerts(alerts) {
    this.alerts = alerts
  }

  removeAlert(index) {
    this.alerts.splice(index, 1)
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new AlertState()