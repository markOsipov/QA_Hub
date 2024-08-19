package qa_hub.service.integrations.tms.qase

import qa_hub.core.utils.DateTimeUtils.currentDateTimeHumanReadable
import qa_hub.entity.testRun.TestResult
import qa_hub.entity.testRun.TestStatus
import qa_hub.service.integrations.tms.CommonTestcase
import qa_hub.service.integrations.tms.qase.entity.*

class QaseClient(baseUrl: String, authToken: String) {
    private val client = QaseHttpInterface.getClient(baseUrl, authToken)

    fun createTestRun(projectCode: String, testRunName: String?): QaseCreateTestrunResponse {
        return client.createTestRun(
            projectCode,
            QaseCreateTestrunRequest(
                title = testRunName ?: "Autotest launch ${currentDateTimeHumanReadable()}"
            )
        ).execute().body()!!
    }

    fun completeTestRun(projectCode: String, testRunId: String): QaseCompleteTestrunResponse {
        return client.completeTestRun(projectCode, testRunId)
            .execute().body()!!
    }

    fun getTestcases(projectCode: String): List<CommonTestcase> {
        val limit = 100
        var offset = 0
        var finished = false
        var errors = 0

        val result = mutableListOf<CommonTestcase>()
        while (!finished && errors <= 5) {
            try {
                val response = client.getTestcases(projectCode, limit, offset).execute().body()!!
                result.addAll(
                    response.result.entities.map {
                        CommonTestcase(
                            it.id.toString(),
                            !it.isManual,
                            QaseStatus.getNameByCode(it.status)
                        )
                    }
                )
                offset += response.result.count
                finished = response.result.count < limit
            } catch (e: Exception) {
                e.printStackTrace()
                errors += 1
            }
        }

        return result
    }

    fun postTestResult(projectCode: String, testResult: TestResult): String {
        val requestBody = QaseCreateTestResultRequest(
            case_id = testResult.testcaseId.toInt(),
            status = if (testResult.status == TestStatus.SUCCESS.status) { QaseTestResult.PASSED.result } else { QaseTestResult.FAILED.result },
            stacktrace = testResult.message,
            time = testResult.duration?.toInt() ?: 0
        )

        return client.postTestResult(projectCode, testResult.tmsLaunchId!!, requestBody).execute().body()!!.result.hash
    }
}
