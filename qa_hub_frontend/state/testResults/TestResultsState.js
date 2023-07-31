import {makeAutoObservable} from "mobx";

class TestResultsState {
  testResults = []
  selectedTest = null

  setTestResults(testResults) {
    this.testResults = testResults
  }

  setSelectedTest(testResult) {
    this.selectedTest = testResult
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new TestResultsState()