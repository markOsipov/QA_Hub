package qa_hub.entity.testRun

enum class QaResolution(var value: String) {
    UNREVIEWED("Unreviewed"),
    PASSED_LOCALLY("PassedLocally"),
    NEED_REPAIR("NeedRepair"),
    TECH_PROBLEM("TechProblem"),
    BUG("Bug")
}
data class QaReview(
    var testRunId: String,
    var fullName: String,
    var qaComment: String?,
    var qaResolution: String?
)

