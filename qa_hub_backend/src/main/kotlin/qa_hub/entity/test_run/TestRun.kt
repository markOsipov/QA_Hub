package qa_hub.entity.test_run

enum class TestRunStatus(val status: String, isFinal: Boolean = false) {
    CREATED("created"),
    PROCESSING("processing"),
    FINISHED("finished", true),
    STOPPED("stopped", true),
    ERROR("error", true)
}

data class TestRunParam(
    val name: String,
    val value: String
)
data class CreateTestRunRequest(
    val project: String,
    val params: List<TestRunParam>
)

data class StartTestRunRequest(
    val testRunId: String? = null,
    val mainInfo: TestRunMainInfo,
    val gitlabRunner: String? = null,
    val testList: List<TestListElement>? = null
)

data class TestListElement(
    val testcaseId: String = "",
    val fullName: String
)
data class TestRun(
    var _id: String? = null,
    var status: String,
    var mainInfo: TestRunMainInfo,

    var testsCount: Int? = null,
    var failsCount: Int? = null,
    var successCount: Int? = null,

    var startDate: String,
    var endDate: String? = null,
    var duration: Long? = null,
)

data class TestRunMainInfo(
    var project: String,

    var pipelineId: String? = null,
    var tmsLaunchId: String? = null,

    var branch: String = "unknown",
    var commit: String = "unknown",
    var environment: String? = "unknown",

    var retries: Int = 1,
    var parallelThreads: Int = 1,
    var tags: List<String> = listOf(),
)