import {makeAutoObservable} from "mobx";
import {blockTest, editBlockedTest, getBlockedTests, unblockTest} from "../requests/BlockerRequests";

class BlockerState {
  blockedTests = []
  taskTrackerInfo = {}
  tmsInfo = {}

  setBlockedTests(blockedTests) {
    this.blockedTests = blockedTests
  }

  updateBlockedTests(project, team, afterAction) {
    getBlockedTests(project, team).then(blockedTestsResponse => {
      this.setBlockedTests(blockedTestsResponse.data)

      if (afterAction) {
        afterAction()
      }
    })
  }

  blockTest(newBlockedTest, afterAction) {
    blockTest(newBlockedTest).then(() => {
      this.updateBlockedTests(newBlockedTest.project, null, afterAction)
    })
  }

  unblockTest(blockedTest) {
    unblockTest(blockedTest).then( response => {
      if (response.data.deletedCount > 0) {
        this.updateBlockedTests(blockedTest.project)
      }
    })
  }

  editBlockedTest(blockedTest) {
    editBlockedTest(blockedTest).then( response => {
      if (response.data.deletedCount > 0) {
        this.updateBlockedTests(blockedTest.project)
      }
    })
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new BlockerState()