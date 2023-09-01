package qa_hub.service.integrations.tms.allure

import qa_hub.core.utils.DateTimeUtils.currentDateTimeHumanReadable
import qa_hub.service.integrations.tms.allure.entity.AllureCreateTestrunRequest
import qa_hub.service.integrations.tms.allure.entity.AllureCreateTestrunResponse

class AllureClient(baseUrl: String, authToken: String) {
    private val client = AllureHttpInterface.getClient(baseUrl, authToken)

    fun createTestRun(projectId: Int, testRunName: String = "Autotest launch ${currentDateTimeHumanReadable()}"): AllureCreateTestrunResponse {
        return client.createTestRun(
                AllureCreateTestrunRequest(
                    projectId = projectId,
                    name = testRunName
                )
            ).execute().body()!!
    }
}
