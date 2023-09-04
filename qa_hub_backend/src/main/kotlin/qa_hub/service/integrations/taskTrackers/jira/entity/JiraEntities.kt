package qa_hub.service.integrations.taskTrackers.jira.entity

data class JiraIssue(
    val key: String,
    val fields: JiraIssueFields
)

data class JiraIssueFields(
    val status: JiraStatusField
)

data class JiraStatusField(
    val name: String,
    val statusCategory: JiraStatusCategory
)

data class JiraStatusCategory(
    val key: String,
    val colorName: String,
    val name: String
)

class JiraIssueResponse(jiraIssue: JiraIssue) {
    var key: String? = null
    var statusName: String? = null
    var statusKey: String? = null
    var statusColor: String? = null

    init {
        this.key = jiraIssue.key
        this.statusKey = jiraIssue.fields.status.statusCategory.key
        this.statusName = jiraIssue.fields.status.name
        this.statusColor = jiraIssue.fields.status.statusCategory.colorName
    }
}