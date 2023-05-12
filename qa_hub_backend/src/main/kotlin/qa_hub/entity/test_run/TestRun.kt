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
data class TestRunRequest(
    val project: String,
    val params: List<TestRunParam>
)

data class TestRun(
    var id: String,
    var project: String,

    var cicdJobId: String? = null,
    var tmsLaunchId: String? = null,

    var branch: String = "unknown",
    var commit: String? = null,
    var environment: String? = "unknown",

    var status: String,
    var startDate: String,
    var endDate: String? = null,
    var duration: Long? = null,

    var testsCount: Int? = null,
    var failsCount: Int? = null,
    var successCount: Int? = null,

    var retries: Int? = null,
    var parallelThreads: Int? = null,

    var tags: List<String> = listOf()
)

