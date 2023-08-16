package qa_hub.service.testResults

import kotlinx.coroutines.runBlocking
import org.litote.kmongo.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.entity.testRun.*
import java.math.RoundingMode

@Service
class TestStatsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient


    private val testResultsCollection by lazy {
        mongoClient.db.getCollection<TestResult>(Collections.TEST_RESULTS.collectionName)
    }

    private val testRunsCollection by lazy {
        mongoClient.db.getCollection<TestRun>(Collections.TEST_RUNS.collectionName)
    }



    private fun getFilteredTestRuns(project: String, filter: TestResultsFilter?): List<TestRun> = runBlocking {
        val requestFilter = mutableListOf(TestRun::project eq project)

        filter?.branch?.let {
            requestFilter.add(TestRun::config / TestRunConfig::branch eq filter.branch)
        }

        filter?.tag?.let {
            requestFilter.add(TestRun::config / TestRunConfig::branch eq filter.branch)
        }

        val request = mutableListOf(
            match(
                *requestFilter.toTypedArray()
            )
        )

        filter?.takeLast?.let {
            request.add(limit(filter.takeLast))
        }

        request.add(sort(descending(TestRun::timeMetrics / TestRunTimeMetrics::created)))

        testRunsCollection.aggregate<TestRun>(request).toList()
    }

    data class TestStatElement(
        val _id: String,
        val avgRetries: Double,
        val avgDuration: Int,
        val totalRuns: Int,
        val successRuns: Int,
        val successRate: Double?,
        val results: MutableList<TestResult> = mutableListOf()
    )

    data class TestStatResult(
        val duration: Double?,
        val status: String,
        val retries: Int?
    )

    fun getStatsForProject(project: String, filter: TestResultsFilter?): List<TestStats> = runBlocking {
        val filteredTestRuns = getFilteredTestRuns(project, filter)
        val filteredTestRunIds = filteredTestRuns.map { it.testRunId }

        val groupedTestResults = testResultsCollection.aggregate<TestStatElement>(
            listOf(
                match(
                   TestResult::testRunId `in` filteredTestRunIds,
                   TestResult::status `in` listOf(TestStatus.SUCCESS.status, TestStatus.FAILURE.status)
                ),
                group(
                   TestResult::fullName,
                   TestStatElement::avgRetries avg TestResult::retries,
                   TestStatElement::avgDuration avg TestResult::duration,
                   TestStatElement::totalRuns sum 1,
                   TestStatElement::successRuns sum cond(
                       TestResult::status eq TestStatus.SUCCESS.status, 1, 0
                   ),
                   TestStatElement::results push "${"$$"}ROOT"
                )
            )
        ).toList()

        val result = mutableListOf<TestStats>()
        groupedTestResults.forEach { testStatsElement ->
            val lastRun = filteredTestRuns.firstOrNull {
               it.testRunId == testStatsElement.results.firstOrNull { result -> result.testRunId == it.testRunId }?.testRunId
            }?.timeMetrics?.created

            val lastSuccess = filteredTestRuns.firstOrNull {
                it.testRunId == testStatsElement.results.firstOrNull {
                    result -> result.testRunId == it.testRunId && result.status == TestStatus.SUCCESS.status
                }?.testRunId
            }?.timeMetrics?.created

            val successRate = (testStatsElement.successRuns.toDouble() / testStatsElement.totalRuns.toDouble())
                .toBigDecimal()
                .setScale(2, RoundingMode.CEILING)
                .toDouble()

            val testStats = TestStats(
                fullName = testStatsElement._id,
                totalRuns = testStatsElement.totalRuns,
                successRuns = testStatsElement.successRuns,
                successRate = successRate,
                averageDuration = testStatsElement.avgDuration,
                averageRetries = testStatsElement.avgRetries,
                lastRun = lastRun,
                lastSuccess = lastSuccess
            )

            result.add(testStats)
        }

        return@runBlocking result
    }
}