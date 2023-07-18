package qa_hub.entity.testRun

enum class QaResolution(var value: String) {
    UNREVIEWED("Unreviewed"),
    PASSED_LOCALLY("PassedLocally"),
    NEED_REPAIR("NeedRepair"),
    TECH_PROBLEM("TechProblem"),
    BUG("Bug")
}
data class TestResultQaResolution(
    var testRunId: String,
    var fullName: String,
    var qaComments: MutableList<TestResultQaComment> = mutableListOf(),
    var qaResolution: String? = QaResolution.UNREVIEWED.value,
)

data class TestResultQaComment(
    val text: String,
    val author: String? = "unknown",
    val date: String
)

