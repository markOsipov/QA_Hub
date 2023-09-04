package qa_hub.service.integrations.taskTrackers.jira

import qa_hub.service.integrations.taskTrackers.jira.entity.JiraIssueResponse

class JiraClient(baseUrl: String, username: String, apiToken: String) {
    private val client = JiraHttpInterface.getClient(baseUrl, username, apiToken)

    fun getIssue(key: String): JiraIssueResponse {
        return JiraIssueResponse(
            client.getIssue(key)
                .execute()
                .body()!!
        )
    }
}
