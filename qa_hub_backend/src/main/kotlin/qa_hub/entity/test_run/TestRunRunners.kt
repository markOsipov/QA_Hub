package qa_hub.entity.test_run

data class TestRunners(
    val testRunId: String,
    val runners: MutableList<TestRunRunner> = mutableListOf()
)
data class TestRunRunner(
    var name: String,
    var started: String? = null,
    var finished: String? = null,
    var withError: Boolean = false
)