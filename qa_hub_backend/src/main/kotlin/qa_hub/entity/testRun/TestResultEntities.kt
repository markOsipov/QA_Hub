package qa_hub.entity.testRun

data class TestResult(
    var testRunId: String,
    var testrailId: String = "",
    var project: String?,
    var fullName: String,

    var duration: Double? = null,
    var status: String,
    var message: String? = null,
    var gitlabRunner: String? = null,
    var device: String? = "simulator",
    var deviceRuntime: String? = null,
    var deviceUdid: String? = null,
    var qaComment: String? = null,
    var qaResolution: String? = QaResolution.UNREVIEWED.value,
    var retries: Int = 0,
    var attachments: List<String>? = null
)

enum class QaResolution(var value: String) {
    UNREVIEWED("Unreviewed"),
    PASSED_LOCALLY("PassedLocally"),
    NEED_REPAIR("NeedRepair"),
    TECH_PROBLEM("TechProblem"),
    BUG("Bug")
}

enum class TestStatus(val status: String) {
    SUCCESS("SUCCESS"),
    FAILURE("FAILURE"),
    WAITING("WAITING"),
    PROCESSING("PROCESSING")
}