package qa_hub.entity.test_run

enum class QaResolution(val value: String) {
    UNREVIEWED( "unreviewed"),
    PASSED_LOCALLY("passedLocally"),
    NEED_TO_REPAIR("needToRepair"),
    TECH_PROBLEM("techProblem"),
    BUG("bug")
}

enum class TestStatus(val value: String) {
    WAITING("waiting"),
    PROCESSING("processing"),
    SUCCESS("success"),
    FAILURE("failure")
}
data class TestResult(
    var testRunId: String,
    var testcaseId: String = "",
    var fullName: String,
    var resultDate: String,
    var status: String,

    var duration: Double? = null,
    var message: String? = null,
    var gitlabRunner: String? = null,
    var device: String? = null,
    var deviceRuntime: String? = null,
    var deviceUdid: String? = null,
    var qaComment: String? = null,
    var qaResolution: String? = QaResolution.UNREVIEWED.value,
    var retries: Int? = null,
    var attachments: List<String>? = null
)

