import {makeAutoObservable} from "mobx";

class PushModalState {
  isOpen = false
  testRun = null

  open(testRun) {
    this.testRun = testRun
    this.isOpen = true
  }

  close() {
    this.testRun = null
    this.isOpen = false
  }
  setIsOpen(value) {
    this.isOpen = value
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new PushModalState()