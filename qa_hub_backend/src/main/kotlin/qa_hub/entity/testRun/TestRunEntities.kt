package qa_hub.entity.testRun
data class TestRunRequestParam(
    val name: String,
    val value: String
)

open class CreateTestRunRequest(
    var project: String,
    var branch: String,
    var params: MutableList<TestRunRequestParam> = mutableListOf(),
)

data class TestRunsRequest(
    val filter: TestRunFilter? = null,
    val pagination: Pagination? = Pagination()
)
data class TestRunFilter(
    val statuses: List<String> = listOf(),
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
    var tags: MutableList<String> = mutableListOf(),

    var runner: String? = null,
    var simulators: List<String> = listOf(),
    var cicdJobId: String? = null,
    var tmsLaunchName: String? = null,
    var tmsLaunchId: String? = null,
    var tmsAutoExport: Boolean = false
): CreateTestRunRequest(project, config.branch, params)

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

    var startedByRunner: String? = null,
    var cicdJobId: String? = null,
    var tmsLaunchId: String? = null,
    var tmsAutoExport: Boolean = false
)

data class TestRunConfig(
    var branch: String = "unknown",
    var commit: String = "unknown",
    var environment: String = "unknown",
    var retries: Int = 1,
    var parallelThreads: Int = 1
)
enum class TestRunStatus(val status: String, val isFinal: Boolean) {
    CREATED("CREATED", false),
    PROCESSING("PROCESSING", false),
    FINISHED("FINISHED", true),
    CANCELED("CANCELED", true),
    ERROR("ERROR", true);

    companion object {
        val finalStatuses = values()
            .filter { it.isFinal }
            .map { it.status }
    }
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
    val title: String = "",
    val fullName: String
)

data class TestQueue(
    val testRunId: String,
    val queue: MutableList<String> = mutableListOf()
)

data class NextTestResponse(
    var nextTest: String?,
    val testId: String?,
    val title: String?,
    val retry: Int?
)