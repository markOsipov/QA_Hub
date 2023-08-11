package qa_hub.service.integrations.taskTrackers.jira

import qa_hub.service.integrations.taskTrackers.jira.entity.JiraIssueResponse

class JiraClient(baseUrl: String, username: String, apiToken: String) {
    private val jiraService = JiraHttpInterface.getClient(baseUrl, username, apiToken)

    fun getIssue(key: String): JiraIssueResponse {
        return JiraIssueResponse(
            jiraService
                .getIssue(key)
                .execute()
                .body()!!
        )
    }
}
