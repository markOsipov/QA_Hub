import {makeAutoObservable} from "mobx";
import {blockTest, editBlockedTest, getBlockedTests, unblockTest} from "../requests/BlockerRequests";

class BlockerState {
  blockedTests = []
  taskTrackerInfo = {}
  tmsInfo = {}

  setBlockedTests(blockedTests) {
    this.blockedTests = blockedTests
  }

  updateBlockedTests(project, afterAction) {
    getBlockedTests(project).then(blockedTestsResponse => {
      this.setBlockedTests(blockedTestsResponse.data)

      if (afterAction) {
        afterAction()
      }
    })
  }

  blockTest(newBlockedTest, afterAction) {
    blockTest(newBlockedTest).then(() => {
      this.updateBlockedTests(newBlockedTest.project, afterAction)
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

  setTaskTrackerInfo(taskTrackerInfo) {
    let taskUrl = taskTrackerInfo.baseUrl
    if (taskTrackerInfo?.type === "Jira") {
      taskUrl += "/browse"

      taskUrl = taskUrl.replace("//browse", "/browse")
    }

    this.taskTrackerInfo = { ...taskTrackerInfo, taskUrl: taskUrl}
  }

  setTmsInfo(tmsInfo) {
    let testcaseUrl = tmsInfo?.tmsInfo?.baseUrl
    if (tmsInfo?.projectTmsInfo?.type === "Allure") {
      testcaseUrl += `/project/${tmsInfo.projectTmsInfo?.project}/test-cases/`

      testcaseUrl = testcaseUrl.replace("//project", "/project")
    }

    this.tmsInfo = { ...tmsInfo, testcaseUrl: testcaseUrl}
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new BlockerState()