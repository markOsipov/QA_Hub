package qa_hub.entity.test_run

data class TestRunTestQueue(
    val testRunId: String,
    val queue: MutableList<String> = mutableListOf()
)