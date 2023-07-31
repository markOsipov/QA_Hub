package qa_hub.service.cicd.entity

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
)
abstract class CicdIntegrationAbstract(val cicdInfo: CicdInfo) {
    abstract fun startJob()

    abstract fun stopJob()

    abstract fun getBranches()
}

