package qa_hub.service.integrations.cicd

import qa_hub.entity.ProjectCicdInfo
import qa_hub.service.integrations.cicd.github.GitHubService

data class CicdType(
    val cicdName: String,
    val authTypes: List<String> = CicdAuthType.values().map{ it.authType }
)

enum class CicdTypes(
    val cicdType: CicdType
) {
    GITHUB(CicdType("GitHub")),
    TESTRAIL(CicdType("GitLab"))
}

enum class CicdAuthType(val authType: String) {
    API_TOKEN("ApiToken"),
    PASSWORD("Password")
}

data class CicdInfo(
    var _id: String? = null,
    val cicdType: String,
    val baseUrl: String,
    val apiToken: String? = null,
    val login: String? = null,
    val password: String? = null,
) {
    fun cicdService(): CicdIntegrationAbstract? {
        return when (cicdType) {
            CicdTypes.GITHUB.cicdType.cicdName -> GitHubService(this)
            else -> null
        }
    }
}

data class StartJobRequest(
    val gitRef: String,
    val params: Map<String, String>
)

abstract class CicdIntegrationAbstract(val cicdInfo: CicdInfo) {
    abstract fun startJob(info: ProjectCicdInfo, jobId: String, startJobRequest: StartJobRequest)

    abstract fun stopJob(info: ProjectCicdInfo, jobId: String)

    abstract fun getBranches(info: ProjectCicdInfo): List<String>
}

