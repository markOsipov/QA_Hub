package qa_hub.service

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
import java.time.LocalDateTime

@Service
class TestResultsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val testResultsCollection by lazy {
        mongoClient.db.getCollection<TestResult>(Collections.TEST_RESULTS.collectionName)
    }

    private val testStatusHistoryCollection by lazy {
        mongoClient.db.getCollection<TestStatusHistory>(Collections.TEST_STATUS_HISTORY.collectionName)
    }

    fun findTestResults(testRunId: String): List<TestResult> = runBlocking {
        testResultsCollection.aggregate<TestResult>(
            match(  TestResult::testRunId eq testRunId),
            sort(ascending(TestResult::fullName))
        ).toList()
    }

    fun upsertTestResult(testResult: TestResult, incRetries: Boolean = true): UpdateResult = runBlocking {
        val set = set(
            *(testResult.setCurrentPropertyValues(skipProperties = listOf("testRunId", "fullName", "retries")))
        )
        val update = if (incRetries) {
            combine(set, inc(TestResult::retries,  1))
        } else { set }

        updateStatusHistory(testResult)

        testResultsCollection.updateOne(
            and(
                TestResult::testRunId eq testResult.testRunId,
                TestStatusHistory::fullName eq testResult.fullName
            ),
            update
        )
    }

    fun updateStatusHistory(testResult: TestResult) = runBlocking {
        testStatusHistoryCollection.updateOne(
            and(
                TestStatusHistory::testRunId eq testResult.testRunId,
                TestStatusHistory::fullName eq testResult.fullName
            ),
            push(
                TestStatusHistory::statusHistory, StatusHistoryItem(
                    status = testResult.status,
                    message = testResult.message,
                    date = LocalDateTime.now().toString(),
                    duration = testResult.duration,
                    gitlabRunner = testResult.gitlabRunner,
                    device = testResult.device,
                    deviceRuntime = testResult.deviceRuntime,
                    deviceUdid = testResult.deviceUdid
                )
            )
        )
    }

    fun forceStopForDevice(testRunId: String, simulatorId: String) = runBlocking {
        val hangingTests = testResultsCollection.find(
            and(TestResult::testRunId eq testRunId,
                TestResult::deviceUdid eq simulatorId,
                TestResult::status eq TestStatus.PROCESSING.status
            )
        ).toList()

        hangingTests.forEach {
            forceStop(
                testRunId = testRunId,
                fullName = it.fullName,
                incRetries = true,
                message = "Unexpected test failure."
            )
        }
    }

    fun forceStop(testRunId: String,
                  fullName: String,
                  incRetries: Boolean,
                  message: String): UpdateResult = runBlocking {
        val filter = and(
            TestResult::testRunId eq testRunId,
            TestResult::fullName eq fullName
        )
        val status = "failure"

        val set = set(
            TestResult::status setTo  status,
            TestResult::message setTo message
        )

        val update = if (incRetries) {
            combine(inc(TestResult::retries, 1), set)
        } else { set }


        testStatusHistoryCollection.updateOne(
            filter,
            push(
                TestStatusHistory::statusHistory,
                StatusHistoryItem(
                    status = status,
                    message = message,
                    date = LocalDateTime.now().toString()
                )
            )
        )

        testResultsCollection.updateOne(
            filter,
            update
        )
    }
}