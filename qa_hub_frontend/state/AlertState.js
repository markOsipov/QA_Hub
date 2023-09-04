import {makeAutoObservable} from "mobx";

class AlertState {
  alerts = []

  severities = {
    info: 'info',
    success: 'success',
    error: 'error',
    warning: 'warning'
  }
  showAlert(title, severity) {
    this.alerts.push({ title: title, severity: severity || this.severities.info })
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