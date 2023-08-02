package qa_hub.service.integrations.taskTrackers

import qa_hub.service.integrations.taskTrackers.jira.JiraService

data class TaskTrackerType(
    val name: String,
    val authTypes: List<String> = AuthType.values().map{ it.authType }
)

enum class TaskTrackerTypes(
    val type: TaskTrackerType
) {
    JIRA(TaskTrackerType("Jira"))
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
    fun getService(): TaskTrackerIntegrationAbstract? {
        return when (type) {
            TaskTrackerTypes.JIRA.type.name -> JiraService(this)
            else -> null
        }
    }
}

data class TaskStatusResponse(
    val task: String,
    val statusInfo: Any
)
abstract class TaskTrackerIntegrationAbstract(val info: TaskTrackerInfo) {
    abstract fun getTaskStatus(task: String): TaskStatusResponse

}

