package qa_hub.entity.test_run

data class TestRunTestQueue(
    val testRunId: String,
    val queue: MutableList<TestRunTestQueueItem> = mutableListOf()
)

data class TestRunTestQueueItem(
    val ticket: String,
    val enlistDate: String
)