package qa_hub.service.integrations.taskTrackers

import qa_hub.service.integrations.taskTrackers.asana.AsanaService
import qa_hub.service.integrations.taskTrackers.jira.JiraService

data class TaskTrackerType(
    val name: String,
    val authTypes: List<String> = AuthType.values().map{ it.authType }
)

enum class TaskTrackerTypes(
    val type: TaskTrackerType
) {
    JIRA(TaskTrackerType("Jira")),
    ASANA(TaskTrackerType("Asana"))
}

enum class AuthType(val authType: String) {
    API_TOKEN("ApiToken"),
    PASSWORD("Password")
}

class TaskTrackerInfo(
    var _id: String? = null,
    val type: String,
    val baseUrl: String,
    val apiToken: String? = null,
    val login: String? = null,
    val password: String? = null,
) {
    fun taskTrackerService(): TaskTrackerIntegrationAbstract? {
        return when (type) {
            TaskTrackerTypes.JIRA.type.name -> JiraService(this)
            TaskTrackerTypes.ASANA.type.name -> AsanaService(this)
            else -> null
        }
    }
}

data class TaskStatusInfo(
    val statusName: String?,
    val statusColor: String?
)

data class TaskStatusResponse(
    val task: String,
    val statusInfo: TaskStatusInfo
)

abstract class TaskTrackerIntegrationAbstract(val info: TaskTrackerInfo) {
    abstract fun getTaskStatus(task: String): TaskStatusResponse

}

