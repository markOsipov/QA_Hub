package qa_hub.entity.test_run

data class TestRunTestQueue(
    val testRunMongoId: String,
    val queue: MutableList<String> = mutableListOf()
)