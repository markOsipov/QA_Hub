package qa_hub.service

import kotlinx.coroutines.*
import org.litote.kmongo.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections.TEST_RUNS
import qa_hub.core.mongo.entity.Collections.TEST_RESULTS
import qa_hub.core.mongo.entity.Collections.TEST_QUEUE
import qa_hub.core.mongo.utils.setCurrentPropertyValues
import qa_hub.entity.testRun.*
import qa_hub.utils.DateTimeHelper.currentDateTimeUtc
import java.time.LocalDateTime
import kotlin.random.Random


@Service
class TestRunService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    @Autowired
    lateinit var testResultsService: TestResultsService

    private val testRunCollection by lazy {
        mongoClient.db.getCollection<TestRun>(TEST_RUNS.collectionName)
    }

    private val testResultsCollection by lazy {
        mongoClient.db.getCollection<TestResult>(TEST_RESULTS.collectionName)
    }

    private val testQueueCollection by lazy {
        mongoClient.db.getCollection<TestQueue>(TEST_QUEUE.collectionName)
    }
    fun createTestRun(testRunRequest: CreateTestRunRequest): TestRun = runBlocking {
        val creationDate = currentDateTimeUtc()
        val testRun = TestRun(
            testRunId = creationDate,
            projectId = testRunRequest.projectId,
            timeMetrics = TestRunTimeMetrics(
                created = currentDateTimeUtc()
            ),
            params = testRunRequest.params,
            status = TestRunStatus.CREATED.status
        )

        testRunCollection.insertOne(testRun)

        return@runBlocking getTestRun(testRun.testRunId)!!
    }

    fun startTestRun(startTestRunRequest: StartTestRunRequest) = runBlocking {
        val testRun: TestRun = if (startTestRunRequest.testRunId.isNullOrBlank()) {
            createTestRun(startTestRunRequest)
        } else {
            getTestRun(startTestRunRequest.testRunId!!)!!
        }
        val startDate = currentDateTimeUtc()
        val started = testRun.status == TestRunStatus.PROCESSING.status

        if (!started) {
            testRun.status = TestRunStatus.PROCESSING.status
            testRun.timeMetrics.started = startDate
            val runner = TestRunRunner(name = startTestRunRequest.runner, started = startDate)

            testRunCollection.updateOne(
                TestRun::testRunId eq testRun.testRunId,
                combine(
                    set(
                        *(testRun.setCurrentPropertyValues(skipProperties = listOf("_id", "testRunId", "runners")))
                    ),
                    push(TestRun::runners, runner)
                )
            )

            testQueueCollection.updateOne(
                TestQueue::testRunId eq testRun.testRunId,
                TestQueue(testRunId = testRun.testRunId),
                upsert()
            )

            val testResults = startTestRunRequest.testList.map {
                TestResult(
                    testRunId = testRun.testRunId,
                    testrailId = it.testId,
                    project = testRun.projectId,
                    fullName = it.fullName,
                    status = TestStatus.WAITING.status
                )
            }

            testResultsCollection.insertMany(testResults)


        } else {
            val runner = TestRunRunner(name = startTestRunRequest.runner, started = startDate)

            testRunCollection.updateOne(
                TestRun::testRunId eq testRun.testRunId,
                push(TestRun::runners, runner)
            )
        }

        return@runBlocking getTestRun(testRun.testRunId)!!
    }

    fun getTestRun(testRunId: String): TestRun? = runBlocking {
        testRunCollection.findOne(
            TestRun::testRunId eq testRunId
        )
    }

    fun enlistInQueue(testRunId: String,
                      queueTicket: String): String = runBlocking {
        testQueueCollection.updateOne(
            TestQueue::testRunId eq testRunId,
            push(TestQueue::queue, queueTicket)
        )

        return@runBlocking queueTicket
    }

    suspend fun waitForYourTurn(testRunId: String, queueTicket: String) {
        val maxWaitTime = 30000L
        val timeout = 500L
        var timePassed = 0L
        withContext(Dispatchers.Default) {
            async {
                while (
                    timePassed < maxWaitTime && testQueueCollection.findOne(TestQueue::testRunId eq testRunId)?.queue?.firstOrNull() != queueTicket
                ) {
                    delay(timeout)
                    timePassed += timeout
                }
            }.await()
        }
    }
    fun leaveQueue(testRunId: String, queueTicket: String) = runBlocking {
        testQueueCollection.updateOne(
            TestQueue::testRunId eq testRunId,
            pull(TestQueue::queue, queueTicket)
        )
    }

    suspend fun getNextTest(testRunId: String, simulatorId: String = "", gitlabRunner: String): NextTestResponse {
        val testRun = getTestRun(testRunId)!!

         if (simulatorId != "") {
             testResultsService.forceStopForDevice(testRunId, simulatorId)
         }

        var queueTicket = simulatorId
        if (simulatorId.isEmpty()) {
            queueTicket = "${LocalDateTime.now()}_${Random.nextInt(1000000, 9999999)}"
        }

        enlistInQueue(testRunId, queueTicket)
        waitForYourTurn(testRunId, queueTicket)

        val testResults = testResultsService.findTestResults(testRunId)

        val waitingTests = testResults.filter { it.status == TestStatus.WAITING.status }
        val readyForRetryTests = testResults
            .filter { it.status == TestStatus.FAILURE.status && ((it.retries ?: 0) < (testRun.retries ?: 1)) }

        val nextTest = waitingTests.firstOrNull() ?: readyForRetryTests.firstOrNull()
        if (nextTest != null) {
            nextTest.status = TestStatus.PROCESSING.status
            nextTest.deviceUdid = simulatorId
            nextTest.gitlabRunner = gitlabRunner
            testResultsService.upsertTestResult(nextTest, false)

            leaveQueue(testRunId, queueTicket)

            return NextTestResponse(
                nextTest = nextTest.fullName,
                testId = nextTest.testrailId,
                lastTestTaken = waitingTests.size + readyForRetryTests.size == 1
            )
        } else {
            leaveQueue(testRunId, queueTicket)

            return NextTestResponse(
                nextTest = null,
                testId = null,
                lastTestTaken = true
            )
        }
    }
}