package qa_hub.entity.test_run

data class TestRunParams (
    val testRunMongoId: String,
    val params: List<TestRunParam>
)