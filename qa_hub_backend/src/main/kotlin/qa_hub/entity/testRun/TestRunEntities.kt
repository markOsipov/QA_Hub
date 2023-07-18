package qa_hub.entity.testRun
data class TestRunRequestParam(
    val name: String,
    val value: String
)

open class CreateTestRunRequest(
    var project: String,
    var params: MutableList<TestRunRequestParam> = mutableListOf(),
)
open class StartTestRunRequest(
    project: String,
    params: MutableList<TestRunRequestParam> = mutableListOf(),
    var testRunId: String?,
    var techInfo: TestRunConfig = TestRunConfig(),
    var testList: MutableList<TestListElement> = mutableListOf(),
    var runner: String?
): CreateTestRunRequest(project, params)
data class TestRun(
    var testRunId: String,
    var project: String,
    var params: MutableList<TestRunRequestParam> = mutableListOf(),
    var timeMetrics: TestRunTimeMetrics,
    var status: String,
    var config: TestRunConfig = TestRunConfig(),
    var tests: TestRunTests = TestRunTests(),
    var runners: MutableList<TestRunRunner> = mutableListOf(),
    var allureLaunchId: String? = null
)

data class TestRunConfig(
    var branch: String = "unknown",
    var commit: String = "unknown",
    var environment: String = "unknown",
    var retries: Int = 1,
    var parallelThreads: Int = 1
)
enum class TestRunStatus(val status: String) {
    CREATED("CREATED"),
    PROCESSING("PROCESSING"),
    FINISHED("FINISHED"),
    CANCELED("CANCELED"),
    ERROR("ERROR")
}
data class TestRunTimeMetrics(
    var created: String,
    var started: String? = null,
    var ended: String? = null,
    var duration: Long? = null,
)
data class TestRunTests(
    var testsCount: Int? = null,
    var failsCount: Int? = null,
    var successCount: Int? = null,
)

data class TestRunRunner(
    var name: String,
    var started: String? = null,
    var finished: String? = null,
    var withError: Boolean = false
)
data class TestListElement(
    val testId: String = "",
    val fullName: String
)

data class TestQueue(
    val testRunId: String,
    val queue: MutableList<String> = mutableListOf()
)

data class NextTestResponse(
    var nextTest: String?,
    val testId: String?,
    var lastTestTaken: Boolean
)