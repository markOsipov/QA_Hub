package qa_hub.entity.testRun

import java.lang.Exception
import kotlin.reflect.full.declaredMemberProperties

data class TestStatsRequest(
    val project: String,
    val filter: TestResultsFilter? = null,
    val pagination: Pagination? = null,
    val sort: Sort? = null
)

data class Sort(
    val fieldName: String,
    val isAscending: Boolean = true
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
    var successRate: Double,
    var avgDuration: Int,
    var avgRetries: Double,
    var lastRun: String? = null,
    var lastSuccess: String? = null,
    var results: MutableList<TestResult> = mutableListOf(),
)

class TestStatsComparator(
    private val sortProperty: String? = null,
    private val isAscending: Boolean
): Comparator<TestStats> {
    override fun compare(o1: TestStats?, o2: TestStats?): Int {
        val kProperty1 = TestStats::class.declaredMemberProperties.firstOrNull { it.name == sortProperty }

        val valueFirst = kProperty1?.get(o1!!).toString()
        val valueSecond = kProperty1?.get(o2!!).toString()

        return try {
            val double1 = valueFirst.toDouble()
            val double2 = valueSecond.toDouble()

            if (isAscending) double1.compareTo(double2) else double2.compareTo(double1)
        } catch (e: Exception) {
            if (isAscending) valueFirst.compareTo(valueSecond) else valueSecond.compareTo(valueFirst)
        }
    }
}