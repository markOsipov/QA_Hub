package qa_hub.service.integrations.taskTrackers.asana.entity

import qa_hub.service.integrations.taskTrackers.asana.AsanaService

data class AsanaTask(
    val gid: String,
    val completed: Boolean
)

data class AsanaTaskResponse(
    val data: AsanaTask
)