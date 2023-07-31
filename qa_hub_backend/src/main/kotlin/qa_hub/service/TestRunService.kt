package qa_hub.service

import kotlinx.coroutines.*
import org.litote.kmongo.*
import org.litote.kmongo.coroutine.aggregate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections.*
import qa_hub.core.mongo.utils.setCurrentPropertyValues
import qa_hub.entity.testRun.*
import qa_hub.core.utils.DateTimeUtils.currentDateTimeUtc
import qa_hub.core.utils.DateTimeUtils.currentEpoch
import qa_hub.service.testResults.TestLogsService
import qa_hub.service.testResults.TestResultsService
import qa_hub.service.testResults.TestStepsService
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
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

    private val testRetriesCollection by lazy {
        mongoClient.db.getCollection<TestResultRetry>(TEST_RESULTS_RETRIES.collectionName)
    }

    private val testQueueCollection by lazy {
        mongoClient.db.getCollection<TestQueue>(TEST_QUEUE.collectionName)
    }

    private val testLogsCollection by lazy {
        mongoClient.db.getCollection<TestLogsService.TestLog>(TEST_LOGS.collectionName)
    }

    private val testStepsCollection by lazy {
        mongoClient.db.getCollection<TestStepsService.TestSteps>(TEST_STEPS.collectionName)
    }

    private val testQaReviewsCollection by lazy {
        mongoClient.db.getCollection<QaReview>(TEST_QA_REVIEWS.collectionName)
    }

    fun getTestRuns(project: String, request: TestRunsRequest?): List<TestRun> = runBlocking {
        val filter = mutableListOf(TestRun::project eq project)

        request?.filter?.let {
            if (it.statuses.isNotEmpty()) {
                filter.add(
                    TestRun::status `in` it.statuses
                )
            }

            if (!it.branch.isNullOrEmpty()) {
                filter.add(
                    TestRun::config / TestRunConfig::branch eq it.branch
                )
            }

            if (!it.commit.isNullOrEmpty()) {
                filter.add(
                    TestRun::config / TestRunConfig::commit eq it.commit
                )
            }

            if (!it.environment.isNullOrEmpty()) {
                filter.add(
                    TestRun::config / TestRunConfig::environment eq it.environment
                )
            }

            if (!it.tag.isNullOrEmpty()) {
                filter.add(
                    TestRun::tags contains it.tag
                )
            }
        }

        val query = mutableListOf(
            match(and(*filter.toTypedArray())),
            sort(descending(TestRun::testRunId)),
            skip(request?.pagination?.skip ?: 0 ))

        if ((request?.pagination?.limit ?: 0)> 0) {
            query.add(limit(request!!.pagination!!.limit) )
        }

        testRunCollection.aggregate<TestRun>(query).toList()
    }
    fun createTestRun(testRunRequest: CreateTestRunRequest): TestRun = runBlocking {
        val testRun = TestRun(
            testRunId = currentEpoch().toString(),
            project = testRunRequest.project,
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
        val runner = TestRunRunner(
            name = startTestRunRequest.runner ?: "Runner ${testRun.runners.size + 1}",
            simulators = startTestRunRequest.simulators,
            started = startDate
        )

        if (!started) {
            testRun.status = TestRunStatus.PROCESSING.status
            testRun.timeMetrics.started = startDate
            testRun.config = startTestRunRequest.config
            testRun.tests = TestRunTests(testsCount = startTestRunRequest.testList.size, 0, 0)

            testRunCollection.updateOne(
                TestRun::testRunId eq testRun.testRunId,
                combine(
                    set(
                        *(testRun.setCurrentPropertyValues(skipProperties = listOf("_id", "testRunId", "runners", "params", "projectId")))
                    ),
                    push(TestRun::runners, runner)
                )
            )

            testQueueCollection.updateOne(
                TestQueue::testRunId eq testRun.testRunId,
                TestQueue(testRunId = testRun.testRunId),
                upsert()
            )

            val updateTestResultRequests = startTestRunRequest.testList.map {
                TestResult(
                    testRunId = testRun.testRunId,
                    testcaseId = it.testId,
                    project = testRun.project,
                    fullName = it.fullName,
                    status = TestStatus.WAITING.status
                )
            }

            testResultsCollection.insertMany(updateTestResultRequests)
        } else {
            testRunCollection.updateOne(
                TestRun::testRunId eq testRun.testRunId,
                push(TestRun::runners, runner)
            )
        }

        return@runBlocking getTestRun(testRun.testRunId)!!
    }

    fun getTestRun(testRunId: String): TestRun? = runBlocking {
        testRunCollection.findOne(TestRun::testRunId eq testRunId)
    }

    private fun enlistInQueue(testRunId: String, queueTicket: String): String = runBlocking {
        testQueueCollection.updateOne(
            TestQueue::testRunId eq testRunId,
            push(TestQueue::queue, queueTicket),
            upsert()
        )

        return@runBlocking queueTicket
    }

    private fun waitForYourTurn(testRunId: String, queueTicket: String) = runBlocking {
        val maxWaitTime = 10000L
        val timeout = 200L
        val deadline = currentEpoch() + maxWaitTime

//        withContext(Dispatchers.Default) {
//            async {
//                while (
//                    currentEpoch() < deadline && testQueueCollection.findOne(TestQueue::testRunId eq testRunId)?.queue?.firstOrNull() != queueTicket
//                ) {
//                    delay(timeout)
//                }
//            }.await()
//        }

        while (
            currentEpoch() < deadline && testQueueCollection.findOne(TestQueue::testRunId eq testRunId)?.queue?.firstOrNull() != queueTicket
        ) {
            delay(timeout)
        }
    }
    private suspend fun leaveQueue(testRunId: String, queueTicket: String) {
        testQueueCollection.updateOne(
            TestQueue::testRunId eq testRunId,
            pull(TestQueue::queue, queueTicket)
        )
    }

    fun getNextTest(testRunId: String, simulatorId: String = "", runner: String): NextTestResponse = runBlocking {
        val testRun = getTestRun(testRunId)!!

        if (simulatorId != "") {
            testResultsService.forceStopForDevice(testRunId, simulatorId, runner)
        }

        var queueTicket = "${runner}_$simulatorId"
        if (simulatorId.isEmpty()) {
            queueTicket = "${currentEpoch()}_${Random.nextInt(1000000, 9999999)}"
        }
        enlistInQueue(testRunId, queueTicket)
        waitForYourTurn(testRunId, queueTicket)

        val nextTest = testResultsCollection.findOne(
            and(
                TestResult::testRunId eq testRunId,
                or(
                    TestResult::status eq TestStatus.WAITING.status,
                    and(
                        TestResult::status eq TestStatus.FAILURE.status,
                        TestResult::retries lt (testRun.config?.retries ?: 1)
                    )
                )
            )
        )

        if (nextTest != null) {
            nextTest.apply {
                status = TestStatus.PROCESSING.status
                deviceId = simulatorId
                this.runner = runner
                retries +=  1
            }

            testResultsService.updateTestResult(nextTest)
            leaveQueue(testRunId, queueTicket)

            return@runBlocking NextTestResponse(
                nextTest = nextTest.fullName,
                testId = nextTest.testcaseId,
                retry = nextTest.retries
            )
        } else {
            leaveQueue(testRunId, queueTicket)

            return@runBlocking NextTestResponse(
                nextTest = null,
                testId = null,
                retry = null
            )
        }
    }

    fun cancelRun(testRunId: String) {
        try {
            val testRun = getTestRun(testRunId)

            //TODO: Add CICD integration
            //val gitlabProject = UtilsDataClass.getProject(testRun.project!!).gitLabId
            //GitLabManager(gitlabTokenService).cancelRun(gitlabProject, testRunId.toInt())
        } finally {
            finishTestRun(testRunId = testRunId, canceled = true)
        }
    }

    private fun getActualTestsCount(testRunId: String) = runBlocking {
        val filter = TestResult::testRunId eq testRunId

        val totalCount = testResultsCollection.countDocuments(filter).toInt()
        val successCount = testResultsCollection.countDocuments(
            and(filter, TestResult::status eq TestStatus.SUCCESS.status)
        ).toInt()
        val failedCount = testResultsCollection.countDocuments(
            and(filter, TestResult::status eq TestStatus.FAILURE.status)
        ).toInt()

        return@runBlocking TestRunTests(
            testsCount = totalCount,
            failsCount = failedCount,
            successCount = successCount,
        )
    }

    fun finishTestRun(
        testRunId: String,
        hasError: Boolean = false,
        canceled: Boolean = false
    ): TestRun = runBlocking {
        var testRun = getTestRun(testRunId)!!

        val testsCount = getActualTestsCount(testRunId)
        val endDate = currentDateTimeUtc()

        val status = if (hasError) {
            TestRunStatus.ERROR.status
        } else if(canceled) {
            TestRunStatus.CANCELED.status
        } else {
            TestRunStatus.FINISHED.status
        }

        val duration = ZonedDateTime.parse(testRun.timeMetrics.started)
            .until(ZonedDateTime.parse(endDate), ChronoUnit.MINUTES)

          testRunCollection.updateOne(
            TestRun::testRunId eq testRun.testRunId,
            set(
                TestRun::tests setTo testsCount,
                TestRun::timeMetrics / TestRunTimeMetrics::ended setTo endDate,
                TestRun::timeMetrics / TestRunTimeMetrics::duration setTo duration,
                TestRun::status setTo status
            )
        )

        testRun = getTestRun(testRunId)!!

        return@runBlocking testRun
    }

    fun finishRunForRunner(
        testRunId: String,
        hasError: Boolean = false,
        runner: String
    ): TestRun = runBlocking {
        val endDate = currentDateTimeUtc()

        testRunCollection.updateOne(
            and(TestRun::testRunId eq testRunId, TestRun::runners / TestRunRunner::name eq runner),
            set(
                TestRun::runners.posOp / TestRunRunner::finished setTo endDate,
                TestRun::runners.posOp / TestRunRunner::withError setTo hasError
            )
        )

        val testRun = getTestRun(testRunId)!!

        var allFinished = true
        var hasError = false

        testRun.runners.forEach {
            if (it.finished == null) {
                allFinished = false
            }
            if (it.withError) {
                hasError = true
            }
        }

        if (allFinished) {
            return@runBlocking finishTestRun(
                testRunId = testRunId,
                hasError = hasError
            )
        }

        return@runBlocking testRun
    }

    fun startRerun(testRunId: String) = runBlocking {
        val testRun = testRunCollection.findOne(TestRun::testRunId eq testRunId)!!

        createTestRun(CreateTestRunRequest(
            testRun.project,
            testRun.params
        ))
    }

    fun deleteTestRun(testRunId: String) = runBlocking {
        testRunCollection.deleteMany(TestRun::testRunId eq testRunId)
        testResultsCollection.deleteMany(TestResult::testRunId eq testRunId)
        testRetriesCollection.deleteMany(TestResultRetry::testRunId eq testRunId)
        testQueueCollection.deleteMany(TestQueue::testRunId eq testRunId)
        testLogsCollection.deleteMany(TestLogsService.TestLog::testRunId eq testRunId)
        testStepsCollection.deleteMany(TestStepsService.TestSteps::testRunId eq testRunId)
        testQaReviewsCollection.deleteMany(QaReview::testRunId eq testRunId)
    }
}