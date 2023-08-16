package qa_hub.entity.testRun

data class TestStatsRequest(
    val project: String,
    val filter: TestResultsFilter? = null,
    val pagination: Pagination? = null
)
data class TestResultsFilter(
    val branch: String?,
    val tag: String?,
    val takeLast: Int?
)

data class TestStats(
    var _id: String,
    var fullName: String,
    var totalRuns: Int,
    var successRuns: Int,
    var successRate: Double,
    var avgDuration: Int,
    var avgRetries: Double,
    var lastRun: String? = null,
    var lastSuccess: String? = null,
    var results: MutableList<TestResult> = mutableListOf()
)