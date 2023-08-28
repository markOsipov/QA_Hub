import {makeAutoObservable} from "mobx";
import {getCookie, QaHubCookies, setCookie} from "../../utils/CookieHelper";

class PushModalState {
  isOpen = false
  testRun = null
  selectedTests = getCookie(QaHubCookies.testsForNextTestRun) || []
  useSelectedTests = false

  open(testRun, useSelectedTests) {
    this.testRun = testRun
    this.isOpen = true
    this.useSelectedTests = useSelectedTests
  }

  setSelectedTests(value) {
    setCookie(QaHubCookies.testsForNextTestRun, value)
    this.selectedTests = value
  }

  close() {
    this.testRun = null
    this.isOpen = false
    this.useSelectedTests = false
  }
  setIsOpen(value) {
    this.isOpen = value
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new PushModalState()