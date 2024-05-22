package qa_hub.entity

data class BlockedTest(
    var _id: String? = null,
    var fullName: String,
    var shortName: String? = null,
    var testcaseId: String? = null,
    var tmsTask: String? = null,
    var comment: String? = null,
    var blockDate: String? = null,
    var project: String,
    var team: String? = null,
    var allowTrialRuns: Boolean? = false
)

enum class BlockedTestHistoryEvent(val event: String) {
    BLOCK("block"),
    EDIT("edit"),
    UNBLOCK("unblock")
}
data class BlockedTestHistoryItem(
    val date: String,
    val event: String,
    val project: String,
    val blockedTest: BlockedTest
)