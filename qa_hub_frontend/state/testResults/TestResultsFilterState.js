import {makeAutoObservable} from "mobx";

class TestResultsFilterState {
  filter = {}
  filterChanged = false

  setFilter(filter) {
    console.log(filter)
    this.filter = filter
  }

  setFilterChanged(value) {
    this.filterChanged = value
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new TestResultsFilterState()