package qa_hub.service.integrations.taskTrackers.asana

import qa_hub.service.integrations.taskTrackers.TaskStatusInfo
import qa_hub.service.integrations.taskTrackers.TaskStatusResponse
import qa_hub.service.integrations.taskTrackers.TaskTrackerInfo
import qa_hub.service.integrations.taskTrackers.TaskTrackerIntegrationAbstract


class AsanaService(info: TaskTrackerInfo): TaskTrackerIntegrationAbstract(info) {
    val client = AsanaClient(info.baseUrl, info.apiToken!!)

    override fun getTaskStatus(task: String): TaskStatusResponse {
        val response = client.getTask(task)

        val statusInfo =  if (response.data.completed) {
            TaskStatusInfo(
                statusColor = "green",
                statusName = "Completed"
            )
        } else {
            TaskStatusInfo(
                statusColor = "yellow",
                statusName = "Open"
            )
        }

        return TaskStatusResponse(
            task = task,
            statusInfo = statusInfo
        )
    }
}