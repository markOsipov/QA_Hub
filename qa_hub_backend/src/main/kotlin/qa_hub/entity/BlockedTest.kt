package qa_hub.entity

data class BlockedTest(
    var _id: String? = null,
    var shortName: String,
    var fullName: String,
    var testcaseId: String?,
    var jiraIssue: String?,
    var comment: String? = null,
    var blockDate: String? = null,
    var project: String,
    var allowTrialRuns: Boolean? = false
)