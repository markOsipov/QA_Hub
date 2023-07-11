package qa_hub.entity.testRun
data class TestRunRequestParam(
    val name: String,
    val value: String
)

open class CreateTestRunRequest(
    var projectId: String,
    var params: MutableList<TestRunRequestParam> = mutableListOf(),
)
open class StartTestRunRequest(
    projectId: String,
    params: MutableList<TestRunRequestParam> = mutableListOf(),

    var testRunId: String?,
    var testList: MutableList<TestListElement> = mutableListOf(),
    var runner: String = "unknown"
): CreateTestRunRequest(projectId, params)
data class TestRun(
    var testRunId: String,
    var projectId: String,
    var params: MutableList<TestRunRequestParam> = mutableListOf(),
    var timeMetrics: TestRunTimeMetrics,
    var status: String,

    var branch: String = "unknown",
    var commit: String = "unknown",
    var environment: String = "unknown",
    var tests: TestRunTests = TestRunTests(),
    var retries: Int? = null,
    var parallelThreads: Int? = null,
    var tags: MutableList<String> = mutableListOf(),
    var runners: MutableList<TestRunRunner> = mutableListOf(),
    var hasError: Boolean = false,
    var allureLaunchId: String? = null
)

enum class TestRunStatus(val status: String) {
    CREATED("Created"),
    PROCESSING("Processing"),
    FINISHED("Finished"),
    CANCELED("Canceled"),
    ERROR("Error")
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