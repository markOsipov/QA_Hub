package qa_hub.entity.testRun

data class TestStatsRequest(
    val project: String,
    val filter: TestResultsFilter?,
    val pagination: Pagination = Pagination()
)
data class TestResultsFilter(
    val branch: String?,
    val tag: String?,
    val takeLast: Int?
)


data class TestStats(
    var fullName: String,
    var totalRuns: Int? = null,
    var successRuns: Int? = null,
    var successRate: Double? = null,
    var averageDuration: Int? = null,
    var averageRetries: Double? = null,
    var lastRun: String? = null,
    var lastSuccess: String? = null,
)