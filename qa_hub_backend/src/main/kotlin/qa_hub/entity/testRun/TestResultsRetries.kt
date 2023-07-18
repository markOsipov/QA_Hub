package qa_hub.entity.testRun

//data class TestResultRetriesInfo(
//    var testRunId: String,
//    var fullName: String,
//
//    var retries: MutableList<TestResultRetry> = mutableListOf()
//)
data class TestResultRetry(
    var testRunId: String,
    var fullName: String,
    var retry: Int,
    var statusHistory: MutableList<StatusHistoryItem>,
)
data class StatusHistoryItem(
    var date: String,
    var status: String,
    var duration: Double? = null,
    var message: String? = null,
    var gitlabRunner: String? = "unknown",
    var device: String? = "unknown",
    var deviceRuntime: String? = "unknown",
    var deviceUdid: String? = "unknown",
    var attachments: MutableList<String> = mutableListOf()
)