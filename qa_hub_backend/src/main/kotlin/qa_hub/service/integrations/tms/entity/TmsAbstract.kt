package qa_hub.service.integrations.tms.entity

data class TmsType(
    val tmsName: String,
    val authTypes: List<String> = TmsAuthType.values().map{ it.authType }
)

enum class TmsTypes(
   val tmsType: TmsType
) {
    ALLURE(TmsType("Allure")),
    TESTRAIL(TmsType("Testrail")),
    TEST_IT(TmsType("TestIt"))
}

enum class TmsAuthType(val authType: String) {
    API_TOKEN("ApiToken"),
    PASSWORD("Password")
}

data class TmsInfo(
    var _id: String? = null,
    val tmsType: String,
    val baseUrl: String,
    val apiToken: String? = null,
    val login: String? = null,
    val password: String? = null,
)
abstract class TmsIntegrationAbstract(val tmsInfo: TmsInfo) {
    abstract fun getProjects(): List<TmsProjectAbstract>
    abstract fun getProject(projectId: String): TmsProjectAbstract
    abstract fun getTestcases(projectId: String): List<TestcaseAbstract>
    abstract fun getTestcase(projectId: String, testcaseId: String): TestcaseAbstract
    abstract fun updateTestcase(projectId: String, testcaseId: String): TestcaseAbstract
}

abstract class TmsProjectAbstract
abstract class TestcaseAbstract