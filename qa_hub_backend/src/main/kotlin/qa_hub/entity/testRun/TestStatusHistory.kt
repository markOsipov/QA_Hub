package qa_hub.entity.testRun
data class TestStatusHistory(
    var testRunId: String,
    var fullName: String,
    var statusHistory: List<StatusHistoryItem> = mutableListOf()
)

data class StatusHistoryItem(
    var status: String,
    var message: String? = null,
    var date: String,
    var duration: Double? = null,
    var gitlabRunner: String? = null,
    var device: String? = "simulator",
    var deviceRuntime: String? = null,
    var deviceUdid: String? = null
)