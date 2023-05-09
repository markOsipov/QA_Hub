package qa_hub.entity.test_run
data class TestRunHistory(
    val testRunMongoId: String,
    val startDate: String? = null,
    val endDate: String? = null,
    val duration: Int? = null,
    val history: List<TestRunHistoryItem> = listOf()
)

data class TestRunHistoryItem(
    val status: String,
    val date: String
)