package qa_hub.service.integrations.tms.qase

import qa_hub.entity.testRun.TestResult
import qa_hub.service.integrations.tms.CommonTestcase
import qa_hub.service.integrations.tms.TmsInfo
import qa_hub.service.integrations.tms.TmsIntegrationAbstract
import qa_hub.service.integrations.tms.TmsProjectAbstract

class QaseService(info: TmsInfo): TmsIntegrationAbstract(info) {
    val client = QaseClient(info.apiUrl, info.apiToken!!)
    override fun getProjects(): List<TmsProjectAbstract> {
        TODO("Not yet implemented")
    }

    override fun getProject(projectId: String): TmsProjectAbstract {
        TODO("Not yet implemented")
    }

    override fun getTestcases(projectId: String): List<CommonTestcase> {
        return client.getTestcases(projectId)
    }

    override fun getTestcase(projectId: String, testcaseId: String): CommonTestcase {
        TODO("Not yet implemented")
    }

    override fun updateTestcase(tmsProject: String, testResult: TestResult): String {
        return client.postTestResult(tmsProject, testResult)
    }

    override fun startTestrun(projectId: String): String {
        return client.createTestRun(projectId).result.id.toString()
    }
}