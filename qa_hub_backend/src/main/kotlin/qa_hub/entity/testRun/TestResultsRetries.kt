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
    var runner: String? = "unknown",
    var device: String? = "unknown",
    var deviceRuntime: String? = "unknown",
    var deviceId: String? = "unknown",
    var attachments: MutableList<TestResultAttachment> = mutableListOf()
) {
    constructor(testResult: TestResult): this(
        date = testResult.date ?: currentDateTimeUtc(),
        status = testResult.status,
        duration = testResult.duration,
        message = testResult.message,
        runner = testResult.runner,
        device = testResult.device,
        deviceRuntime = testResult.deviceRuntime,
        deviceId = testResult.deviceId,
        attachments = testResult.attachments
    )
}