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

    fun getStatsForProject(request: TestStatsRequest): List<TestStats> = runBlocking {
        val filteredTestRuns = getFilteredTestRuns(request.project, request.filter)
        val filteredTestRunIds = filteredTestRuns.map { it.testRunId }

        val groupedTestResults = testResultsCollection.aggregate<TestStats>(
            listOf(
                match(
                   TestResult::testRunId `in` filteredTestRunIds,
                   TestResult::status `in` listOf(TestStatus.SUCCESS.status, TestStatus.FAILURE.status)
                ),
                group(
                   TestResult::fullName,
                    TestStats::fullName first TestResult::fullName,
                    TestStats::avgRetries avg TestResult::retries,
                    TestStats::avgDuration avg TestResult::duration,
                    TestStats::totalRuns sum 1,
                    TestStats::successRuns sum cond(
                       TestResult::status eq TestStatus.SUCCESS.status, 1, 0
                    ),
//                    TestStats::results push "${"$$"}ROOT"
                ),
                skip(request.pagination?.skip ?: 0),
                limit(request.pagination?.limit ?: 50)
            )
        ).toList()

        val result = mutableListOf<TestStats>()
        groupedTestResults.forEach { testStats ->
            val lastRun = filteredTestRuns.firstOrNull {
               it.testRunId == testStats.results.firstOrNull { result -> result.testRunId == it.testRunId }?.testRunId
            }?.timeMetrics?.created

            val lastSuccess = filteredTestRuns.firstOrNull {
                it.testRunId == testStats.results.firstOrNull {
                    result -> result.testRunId == it.testRunId && result.status == TestStatus.SUCCESS.status
                }?.testRunId
            }?.timeMetrics?.created

            val successRate = (testStats.successRuns.toDouble() / testStats.totalRuns.toDouble())
                .toBigDecimal()
                .setScale(2, RoundingMode.CEILING)
                .toDouble()

            testStats.successRate = successRate
            testStats.lastRun = lastRun
            testStats.lastSuccess = lastSuccess

            result.add(testStats)
        }

        return@runBlocking result
    }
}