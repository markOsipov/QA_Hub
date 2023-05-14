package qa_hub.entity.test_run

enum class QaResolution(val value: String) {
    UNREVIEWED( "unreviewed"),
    PASSED_LOCALLY("passedLocally"),
    NEED_TO_REPAIR("needToRepair"),
    TECH_PROBLEM("techProblem"),
    BUG("bug")
}

enum class TestResultStatus(val value: String, val increaseRetries: Boolean = false) {
    WAITING("waiting"),
    PROCESSING("processing"),
    SUCCESS("success", true),
    FAILURE("failure", true)
}
data class TestResultHistoryItem(
    var testRunId: String,
    var testcaseId: String = "",
    var fullName: String,
    var date: String,
    var status: String,

    var duration: Double? = null,
    var message: String? = null,
    var gitlabRunner: String? = null,
    var device: String? = null,
    var deviceRuntime: String? = null,
    var deviceUdid: String? = null,

    var attachments: List<String>? = null
)

data class TestResult(
    val testRunId: String,
    val fullName: String,

    val retries: Int? = null,
    val qaComment: String? = null,
    val qaResolution: String? = QaResolution.UNREVIEWED.value,

    val history: List<TestResultHistoryItem>
)