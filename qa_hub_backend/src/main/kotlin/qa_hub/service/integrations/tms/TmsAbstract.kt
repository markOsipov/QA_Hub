package qa_hub.service.integrations.tms

import qa_hub.entity.testRun.TestResult
import qa_hub.service.integrations.tms.allure.AllureService
import qa_hub.service.integrations.tms.qase.QaseService

data class TmsType(
    val tmsName: String,
    val authTypes: List<String> = TmsAuthType.values().map{ it.authType }
)

enum class TmsTypes(
   val tmsType: TmsType
) {
    ALLURE(TmsType("Allure")),
    QASE(TmsType("Qase")),
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
    val apiUrl: String = baseUrl,
    val apiToken: String? = null,
    val login: String? = null,
    val password: String? = null,
) {
    fun tmsService(): TmsIntegrationAbstract? {
        return when (tmsType) {
            TmsTypes.ALLURE.tmsType.tmsName -> AllureService(this)
            TmsTypes.QASE.tmsType.tmsName -> QaseService(this)
            else -> null
        }
    }
}
abstract class TmsIntegrationAbstract(val tmsInfo: TmsInfo) {
    abstract fun getProjects(): List<TmsProjectAbstract>
    abstract fun getProject(projectId: String): TmsProjectAbstract
    abstract fun getTestcases(projectId: String): List<CommonTestcase>
    abstract fun getTestcase(projectId: String, testcaseId: String): CommonTestcase
    abstract fun updateTestcase(tmsProject: String, testResult: TestResult): String?
    abstract fun startTestrun(projectId: String, testRunName: String?): String
    abstract fun completeTestrun(projectId: String, testRunId: String): String
}

abstract class TmsProjectAbstract
class CommonTestcase(
    val testcaseId: String,
    val automated: Boolean,
    val status: String
)