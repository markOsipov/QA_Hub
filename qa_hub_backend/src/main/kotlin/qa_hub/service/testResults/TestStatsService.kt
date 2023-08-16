package qa_hub.service.testResults

import com.mongodb.client.model.Field
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.*
import org.litote.kmongo.util.idValue
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.core.mongo.utils.divide
import qa_hub.core.mongo.utils.readProperty
import qa_hub.entity.testRun.*
import java.lang.Exception
import java.math.RoundingMode
import kotlin.math.roundToInt
import kotlin.reflect.full.declaredMemberProperties

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

        val groupStatement = group(
            TestResult::fullName,
            TestStats::results push "${"$$"}ROOT",
            TestStats::fullName first TestResult::fullName,
            TestStats::avgDuration avg TestResult::duration,
            TestStats::avgRetries avg TestResult::retries,
        )

        val groupedTestResults = testResultsCollection.aggregate<TestStats>(
            listOf(
                match(
                   TestResult::testRunId `in` filteredTestRunIds,
                   TestResult::status `in` listOf(TestStatus.SUCCESS.status, TestStatus.FAILURE.status)
                ),
                groupStatement
            )
        ).toList()

        var results = mutableListOf<TestStats>()
        groupedTestResults.forEach { testStats ->
            val lastRun = filteredTestRuns.firstOrNull { testRun ->
                testRun.testRunId == testStats.results.firstOrNull { result -> result.testRunId == testRun.testRunId }?.testRunId
            }?.timeMetrics?.created

            val lastSuccess = filteredTestRuns.firstOrNull { testRun ->
                testRun.testRunId == testStats.results.firstOrNull {
                    result -> result.testRunId == testRun.testRunId && result.status == TestStatus.SUCCESS.status
                }?.testRunId
            }?.timeMetrics?.created

            val totalRuns = testStats.results.size
            val successRuns = testStats.results.filter { it.status == TestStatus.SUCCESS.status }.size

            testStats.totalRuns = totalRuns
            testStats.successRuns = successRuns
            testStats.lastRun = lastRun
            testStats.lastSuccess = lastSuccess
            testStats.successRate = ((successRuns.toDouble() / totalRuns.toDouble()) * 100).roundToInt() / 100.0

            testStats.results = mutableListOf()
            results.add(testStats)
        }

        request.sort?.let { sort ->
            results = results.sortedWith(TestStatsComparator(sort.fieldName, sort.isAscending)).toMutableList()
        }

        request.pagination?.let { pagination ->
            results = results.drop(pagination.skip).toMutableList()
            results = results.take(pagination.limit).toMutableList()
        }

        return@runBlocking results
    }
}