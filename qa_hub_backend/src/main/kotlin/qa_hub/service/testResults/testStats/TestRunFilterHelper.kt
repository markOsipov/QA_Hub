package qa_hub.service.testResults.testStats

import kotlinx.coroutines.runBlocking
import org.litote.kmongo.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.entity.testRun.*
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter


@Service
class TestRunFilterHelper {

    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val testRunsCollection by lazy {
        mongoClient.db.getCollection<TestRun>(Collections.TEST_RUNS.collectionName)
    }

    fun getFilteredTestRuns(project: String, filter: TestResultsFilter?): List<TestRun> = runBlocking {
        val requestFilter = mutableListOf(
            TestRun::project eq project,
            TestRun::status `in` TestRunStatus.finalStatuses
        )

        if (!filter?.branch.isNullOrEmpty()) {
            requestFilter.add(TestRun::config / TestRunConfig::branch eq filter!!.branch)
        }

        if (!filter?.tag.isNullOrEmpty()) {
            requestFilter.add(TestRun::tags contains filter!!.tag)
        }

        if (!filter?.environment.isNullOrEmpty()) {
            requestFilter.add(TestRun::config / TestRunConfig::environment eq filter!!.environment)
        }

        val request = mutableListOf(
            match(
                *requestFilter.toTypedArray()
            )
        )

        request.add(sort(descending(TestRun::timeMetrics / TestRunTimeMetrics::created)))

        if (filter?.takeLast != null && filter.takeLast!! > 0) {
            request.add(limit(filter.takeLast!!))
        }

        if (filter?.maxDays != null && filter.maxDays > 0) {
            request.add(
                match(
                    TestRun::timeMetrics / TestRunTimeMetrics::created gt
                            ZonedDateTime.now(ZoneOffset.UTC)
                                .withHour(0).withMinute(0).withSecond(0).withNano(0)
                                .minusDays(filter.maxDays.toLong() - 1)
                                .format( DateTimeFormatter.ISO_INSTANT )
                )
            )
        }

        testRunsCollection.aggregate<TestRun>(request).toList()
    }
}