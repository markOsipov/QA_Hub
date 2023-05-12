package qa_hub.entity.test_run

data class TestRunRunners(
    val testRunId: String,
    val runners: MutableList<TestRunRunner> = mutableListOf()
)
data class TestRunRunner(
    var name: String,
    var started: String,
    var finished: String? = null,
    var withError: Boolean = false
)