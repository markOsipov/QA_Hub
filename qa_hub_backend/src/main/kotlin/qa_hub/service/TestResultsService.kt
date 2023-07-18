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

    private val updateTestResultsCollectionRequest by lazy {
        mongoClient.db.getCollection<TestResult>(Collections.TEST_RESULTS.collectionName)
    }

    private val testResultsRetriesCollection by lazy {
        mongoClient.db.getCollection<TestResultRetry>(Collections.TEST_RESULTS_RETRIES.collectionName)
    }

    fun findTestResults(testRunId: String): List<TestResult> = runBlocking {
        updateTestResultsCollectionRequest.aggregate<TestResult>(
            match(  UpdateTestResultRequest::testRunId eq testRunId),
            sort(ascending(UpdateTestResultRequest::fullName))
        ).toList()
    }

    fun updateTestResult(updateRequest: UpdateTestResultRequest, incRetries: Boolean = true): UpdateResult = runBlocking {

        val testResult = TestResult(
            testRunId = updateRequest.testRunId,
            testcaseId = updateRequest.testcaseId,
            project = updateRequest.project,
            fullName = updateRequest.fullName,
            status =  updateRequest.status,
        )

        val set = set(
            *(testResult.setCurrentPropertyValues(skipProperties = listOf("_id", "testRunId", "fullName", "retries")))
        )
        val update = if (incRetries) {
            combine(set, inc(TestResult::retries,  1))
        } else { set }

        updateRetriesInfo(updateRequest)

        updateTestResultsCollectionRequest.updateOne(
            and(
                UpdateTestResultRequest::testRunId eq updateRequest.testRunId,
                UpdateTestResultRequest::fullName eq updateRequest.fullName
            ),
            update
        )
    }

    fun updateRetriesInfo(updateRequest: UpdateTestResultRequest) = runBlocking {
        val filter = and(
            TestResultRetry::testRunId eq updateRequest.testRunId,
            TestResultRetry::fullName eq updateRequest.fullName
        )

        val historyItem = StatusHistoryItem(
            status = updateRequest.status,
            message = updateRequest.message,
            date = LocalDateTime.now().toString(),
            duration = updateRequest.duration,
            gitlabRunner = updateRequest.gitlabRunner,
            device = updateRequest.device,
            deviceRuntime = updateRequest.deviceRuntime,
            deviceUdid = updateRequest.deviceUdid
        )

        val existingRetries = testResultsRetriesCollection.find(filter).toList()

        if (
            existingRetries.isEmpty() ||
            historyItem.status == TestStatus.PROCESSING.status ||
            TestStatus.isFinal(existingRetries.last().statusHistory.last().status)
        ) {
            testResultsRetriesCollection.insertOne(
                TestResultRetry(
                    testRunId = updateRequest.testRunId,
                    fullName = updateRequest.fullName,
                    retry = existingRetries.size + 1,
                    statusHistory = mutableListOf(historyItem)
                )
            )
        } else {
            testResultsRetriesCollection.updateOne(
                and(
                    TestResultRetry::testRunId eq updateRequest.testRunId,
                    TestResultRetry::fullName eq updateRequest.fullName,
                    TestResultRetry::retry eq existingRetries.size,
                ),
                push(
                    TestResultRetry::statusHistory, historyItem
                )
            )
        }
    }

    fun forceStopForDevice(testRunId: String, simulatorId: String, runner: String) = runBlocking {
        val hangingTests = updateTestResultsCollectionRequest.find(
            and(UpdateTestResultRequest::testRunId eq testRunId,
                UpdateTestResultRequest::deviceUdid eq simulatorId,
                UpdateTestResultRequest::status eq TestStatus.PROCESSING.status
            )
        ).toList()

        hangingTests.forEach {
            forceStop(
                testResult = it,
                simulatorId = simulatorId,
                runner = runner
            )
        }
    }

    fun forceStop(
        testResult: TestResult,
        simulatorId: String,
        runner: String,
        message: String = "Unexpected test failure."
    ): UpdateResult = runBlocking {
        val updateRequest = UpdateTestResultRequest(
            testRunId = testResult.testRunId,
            testcaseId = testResult.testcaseId,
            project = testResult.project,
            fullName = testResult.fullName,
            status = TestStatus.FAILURE.status,
            deviceUdid = simulatorId,
            gitlabRunner = runner,
            message = message
        )

        updateTestResult(updateRequest)
    }
}