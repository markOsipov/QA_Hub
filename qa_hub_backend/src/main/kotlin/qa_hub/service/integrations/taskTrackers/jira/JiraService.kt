package qa_hub.service.integrations.taskTrackers.jira

import qa_hub.service.integrations.taskTrackers.TaskStatusResponse
import qa_hub.service.integrations.taskTrackers.TaskTrackerInfo
import qa_hub.service.integrations.taskTrackers.TaskTrackerIntegrationAbstract


class JiraService(info: TaskTrackerInfo): TaskTrackerIntegrationAbstract(info) {
    val client = JiraClient(info.baseUrl, info.login!!, info.apiToken!!)

    override fun getTaskStatus(task: String): TaskStatusResponse {
        val response = client.getIssue(task)

        return TaskStatusResponse(
            task = task,
            statusInfo = response
        )
    }
}