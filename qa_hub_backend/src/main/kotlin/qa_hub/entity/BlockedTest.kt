package qa_hub.entity

data class BlockedTest(
    var _id: String? = null,
    var fullName: String,
    var shortName: String? = null,
    var testcaseId: String? = null,
    var jiraIssue: String? = null,
    var comment: String? = null,
    var blockDate: String? = null,
    var project: String,
    var team: String? = null,
    var allowTrialRuns: Boolean? = false
)