package qa_hub.service.integrations.taskTrackers.jira

import qa_hub.service.integrations.taskTrackers.TaskStatusInfo
import qa_hub.service.integrations.taskTrackers.TaskStatusResponse
import qa_hub.service.integrations.taskTrackers.TaskTrackerInfo
import qa_hub.service.integrations.taskTrackers.TaskTrackerIntegrationAbstract


class JiraService(info: TaskTrackerInfo): TaskTrackerIntegrationAbstract(info) {
    val client = JiraClient(info.baseUrl, info.login!!, info.apiToken!!)

    override fun getTaskStatus(task: String): TaskStatusResponse {
        val response = client.getIssue(task)

        val statusInfo = TaskStatusInfo(
            statusColor = response.statusColor,
            statusName = response.statusName
        )

        return TaskStatusResponse(
            task = task,
            statusInfo = statusInfo
        )
    }
}