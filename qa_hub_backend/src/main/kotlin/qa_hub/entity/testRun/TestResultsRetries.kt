package qa_hub.entity.testRun

import qa_hub.core.utils.DateTimeUtils.currentDateTimeUtc

data class TestResultRetry(
    var testRunId: String,
    var fullName: String,
    var retry: Int,
    var statusHistory: MutableList<StatusHistoryItem>,
)
class StatusHistoryItem(
    var date: String,
    var status: String,
    var duration: Double? = null,
    var message: String? = null,
    var gitlabRunner: String? = "unknown",
    var device: String? = "unknown",
    var deviceRuntime: String? = "unknown",
    var deviceUdid: String? = "unknown",
    var attachments: MutableList<String> = mutableListOf()
) {
    constructor(testResult: TestResult): this(
        date = currentDateTimeUtc(),
        status = testResult.status,
        duration = testResult.duration,
        message = testResult.message,
        gitlabRunner = testResult.gitlabRunner,
        device = testResult.device,
        deviceRuntime = testResult.deviceRuntime,
        deviceUdid = testResult.deviceId,
        attachments = testResult.attachments
    )
}