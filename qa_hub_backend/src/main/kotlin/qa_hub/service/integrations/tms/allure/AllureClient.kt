package qa_hub.service.integrations.tms.allure

import qa_hub.core.utils.DateTimeUtils.currentDateTimeHumanReadable
import qa_hub.service.integrations.tms.CommonTestcase
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

    fun getTestcases(projectId: Int): List<CommonTestcase> {
        val size = 100
        var page = 0
        var finished = false
        var errors = 0

        val result = mutableListOf<CommonTestcase>()
        while (!finished && errors <= 5) {
            try {
                val response = client.getTestcases(projectId, page, size).execute().body()!!
                result.addAll(response.content.map { CommonTestcase(it.id.toString(), it.automated, it.status.name) })
                page += 1
                finished = response.last
            } catch (e: Exception) {
                e.printStackTrace()
                errors += 1
            }

        }
        return result
    }
}
