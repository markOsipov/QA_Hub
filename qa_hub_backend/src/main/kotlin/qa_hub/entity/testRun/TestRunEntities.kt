package qa_hub.entity.testRun
data class TestRunRequestParam(
    val name: String,
    val value: String
)

open class CreateTestRunRequest(
    var project: String,
    var params: MutableList<TestRunRequestParam> = mutableListOf(),
)

data class TestRunsRequest(
    val filter: TestRunFilter?
)
data class TestRunFilter(
    val status: String?,
    val branch: String?,
    val commit: String?,
    val environment: String?,
    val tag: String?
)
open class StartTestRunRequest(
    project: String,
    params: MutableList<TestRunRequestParam> = mutableListOf(),

    var testRunId: String?,
    var config: TestRunConfig = TestRunConfig(),
    var testList: MutableList<TestListElement> = mutableListOf(),

    var runner: String? = null,
    var simulators: List<String> = listOf()
): CreateTestRunRequest(project, params)

data class TestRun(
    var testRunId: String,
    var project: String,
    var params: MutableList<TestRunRequestParam> = mutableListOf(),
    var timeMetrics: TestRunTimeMetrics,
    var status: String,
    var config: TestRunConfig? = null,
    var tests: TestRunTests = TestRunTests(),
    var tags: MutableList<String> = mutableListOf(),
    var runners: List<TestRunRunner> = listOf(),

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
    var simulators: List<String> = listOf(),
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
    val retry: Int?
)