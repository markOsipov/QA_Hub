import {makeAutoObservable} from "mobx";

class PushModalState {
  isOpen = false
  testRun = null
  selectedTests = []
  useSelectedTests = false

  open(testRun, useSelectedTests) {
    this.testRun = testRun
    this.isOpen = true
    this.useSelectedTests = useSelectedTests
  }

  setSelectedTests(value) {
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