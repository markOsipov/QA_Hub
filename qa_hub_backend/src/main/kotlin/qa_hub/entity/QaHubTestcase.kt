package qa_hub.entity

data class QaHubTestcase(
    var _id: String? = null,
    var project: String,
    var testcaseId: String? = null,
    var description: String,
    var team: String? = null
)