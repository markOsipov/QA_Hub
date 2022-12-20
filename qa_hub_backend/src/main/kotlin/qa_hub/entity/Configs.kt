package qa_hub.entity

import qa_hub.entity.CoreConfigs.*

enum class CoreConfigs(val configName: String) {
    PROJECTS("projects"),
    CREDENTIALS("credentials")
}

open class QaHubConfig(
    val configName: String,
    val isCustom: Boolean = true,
    open val config: Any? = null
)

class QaHubProjectsConfig(
    projects: List<Project> = listOf()
): QaHubConfig(PROJECTS.configName, isCustom = false) {
    override var config: MutableList<Project> = projects.toMutableList()
}

class QaHubCredentialsConfig(
    credentials: Map<String, String> = mapOf()
): QaHubConfig(CREDENTIALS.configName, isCustom = false) {
    override var config: MutableMap<String, String> = credentials.toMutableMap()
}

open class QaHubCustomConfig(
    configName: String,
    customConfig: Map<String, String> = mapOf()
): QaHubConfig(configName) {
    override var config: MutableMap<String, Any?> = customConfig.toMutableMap()
}