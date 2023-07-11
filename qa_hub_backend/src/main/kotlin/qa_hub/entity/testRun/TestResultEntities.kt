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
    var retries: Int? = null,
    var attachments: List<String>? = null
)

enum class QaResolution(var value: String) {
    UNREVIEWED("unreviewed"),
    PASSED_LOCALLY("passedLocally"),
    NEED_REPAIR("needRepair"),
    TECH_PROBLEM("techProblem"),
    BUG(value = "bug")
}

enum class TestStatus(val status: String) {
    SUCCESS("success"),
    FAILURE("failure"),
    WAITING("waiting"),
    PROCESSING("processing")
}