package qa_hub.service.integrations.tms.allure

import qa_hub.entity.testRun.TestResult
import qa_hub.service.integrations.tms.CommonTestcase
import qa_hub.service.integrations.tms.TmsInfo
import qa_hub.service.integrations.tms.TmsIntegrationAbstract
import qa_hub.service.integrations.tms.TmsProjectAbstract

class AllureService(info: TmsInfo): TmsIntegrationAbstract(info) {
    val client = AllureClient(info.baseUrl, info.apiToken!!)
    override fun getProjects(): List<TmsProjectAbstract> {
        TODO("Not yet implemented")
    }

    override fun getProject(projectId: String): TmsProjectAbstract {
        TODO("Not yet implemented")
    }

    override fun getTestcases(projectId: String): List<CommonTestcase> {
        return client.getTestcases(projectId.toInt())
    }

    override fun getTestcase(projectId: String, testcaseId: String): CommonTestcase {
        TODO("Not yet implemented")
    }

    override fun updateTestcase(tmsProject: String, testResult: TestResult): String? {
        //TODO("Not yet implemented")
        return null
    }

    override fun startTestrun(projectId: String, testRunName: String?): String {
        return client.createTestRun(projectId = projectId.toInt(), testRunName).id.toString()
    }

    override fun completeTestrun(projectId: String, testRunId: String): String {
        return client.completeTestRun(testRunId)
    }
}