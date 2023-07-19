package qa_hub.service.testResults

import com.mongodb.client.result.UpdateResult
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.*
import org.litote.kmongo.coroutine.aggregate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.core.mongo.utils.setCurrentPropertyValues
import qa_hub.entity.testRun.*

@Service
class TestResultsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val testResultsCollection by lazy {
        mongoClient.db.getCollection<TestResult>(Collections.TEST_RESULTS.collectionName)
    }

    private val testResultsRetriesCollection by lazy {
        mongoClient.db.getCollection<TestResultRetry>(Collections.TEST_RESULTS_RETRIES.collectionName)
    }

    fun findTestResults(testRunId: String): List<TestResult> = runBlocking {
        testResultsCollection.aggregate<TestResult>(
            match(  TestResult::testRunId eq testRunId),
            sort(ascending(TestResult::fullName))
        ).toList()
    }

    fun findTestRetries(testRunId: String, fullName: String): List<TestResultRetry> = runBlocking {
        testResultsRetriesCollection.aggregate<TestResultRetry>(
            match(
                and(
                    TestResultRetry::testRunId eq testRunId),
                    TestResultRetry::fullName eq fullName
                ),
            sort(ascending(TestResultRetry::retry))
        ).toList()
    }

    fun updateTestResult(testResult: TestResult): UpdateResult = runBlocking {
        val skipProperties = mutableListOf("_id", "testRunId", "fullName")
        if (testResult.status != TestStatus.PROCESSING.status) {
            skipProperties.add("retries")
        }

        updateRetriesInfo(testResult)
        testResultsCollection.updateOne(
            and(
                TestResult::testRunId eq testResult.testRunId,
                TestResult::fullName eq testResult.fullName
            ),
            set(
                *(testResult.setCurrentPropertyValues(skipProperties))
            )
        )
    }

    private fun updateRetriesInfo(testResult: TestResult) = runBlocking {
        val filter = and(
            TestResultRetry::testRunId eq testResult.testRunId,
            TestResultRetry::fullName eq testResult.fullName
        )

        val historyItem = StatusHistoryItem(testResult)
        val existingRetries = testResultsRetriesCollection.find(filter).toList()

        if (
            existingRetries.isEmpty() ||
            historyItem.status == TestStatus.PROCESSING.status ||
            TestStatus.isFinal(existingRetries.last().statusHistory.last().status)
        ) {
            testResultsRetriesCollection.insertOne(
                TestResultRetry(
                    testRunId = testResult.testRunId,
                    fullName = testResult.fullName,
                    retry = existingRetries.size + 1,
                    statusHistory = mutableListOf(historyItem)
                )
            )
        } else {
            testResultsRetriesCollection.updateOne(
                and(
                    TestResultRetry::testRunId eq testResult.testRunId,
                    TestResultRetry::fullName eq testResult.fullName,
                    TestResultRetry::retry eq existingRetries.size,
                ),
                push(
                    TestResultRetry::statusHistory, historyItem
                )
            )
        }
    }

    fun forceStopForDevice(testRunId: String, simulatorId: String, runner: String) = runBlocking {
        val hangingTests = testResultsCollection.find(
            and(TestResult::testRunId eq testRunId,
                TestResult::deviceId eq simulatorId,
                TestResult::status eq TestStatus.PROCESSING.status
            )
        ).toList()

        hangingTests.forEach {
            forceStop(testResult = it)
        }
    }

    private fun forceStop(
        testResult: TestResult,
        message: String = "Unexpected test failure."
    ) = runBlocking {
        testResult.message = message
        testResult.status = TestStatus.FAILURE.status

        updateTestResult(testResult)
    }
}