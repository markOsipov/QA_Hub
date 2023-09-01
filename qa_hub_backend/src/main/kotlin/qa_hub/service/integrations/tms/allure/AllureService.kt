package qa_hub.service.integrations.tms.allure

import qa_hub.service.integrations.taskTrackers.jira.JiraClient
import qa_hub.service.integrations.tms.TestcaseAbstract
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

    override fun getTestcases(projectId: String): List<TestcaseAbstract> {
        TODO("Not yet implemented")
    }

    override fun getTestcase(projectId: String, testcaseId: String): TestcaseAbstract {
        TODO("Not yet implemented")
    }

    override fun updateTestcase(projectId: String, testcaseId: String): TestcaseAbstract {
        TODO("Not yet implemented")
    }

    override fun startTestrun(projectId: String): String {
        return client.createTestRun(projectId = projectId.toInt()).id.toString()
    }
}