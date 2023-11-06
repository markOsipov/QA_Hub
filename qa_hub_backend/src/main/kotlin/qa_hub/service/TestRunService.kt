package qa_hub.service

import com.slack.api.model.Attachment
import com.slack.api.model.block.LayoutBlock
import com.slack.api.model.block.SectionBlock
import com.slack.api.model.block.composition.MarkdownTextObject
import kotlinx.coroutines.*
import org.litote.kmongo.*
import org.litote.kmongo.coroutine.aggregate
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.controller.testRuns.TestRunController
import qa_hub.controller.testRuns.imageDir
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections.*
import qa_hub.core.mongo.utils.setCurrentPropertyValues
import qa_hub.entity.testRun.*
import qa_hub.core.utils.DateTimeUtils.currentDateTimeUtc
import qa_hub.core.utils.DateTimeUtils.currentEpoch
import qa_hub.service.integrations.cicd.StartJobRequest
import qa_hub.service.integrations.cicd.StartJobResponse
import qa_hub.service.integrations.other.slack.OtherIntegrationTypes
import qa_hub.service.integrations.other.slack.SlackClient
import qa_hub.service.testResults.TestLogsService
import qa_hub.service.testResults.TestResultsService
import qa_hub.service.testResults.TestStepsService
import qa_hub.service.utils.ProjectIntegrationsService
import java.io.File
import java.time.LocalDateTime
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
import kotlin.random.Random


@Service
class TestRunService {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    @Autowired
    lateinit var testResultsService: TestResultsService

    @Autowired
    lateinit var projectIntegrationsService: ProjectIntegrationsService

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
    fun createTestRun(testRunRequest: CreateTestRunRequest, startJob: Boolean = true): TestRun = runBlocking {
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

        val insertedTestRun = getTestRun(testRun.testRunId)!!

        if (startJob) {
            val startJobResponse = startJob(insertedTestRun, testRunRequest.branch)
            val code = startJobResponse?.code
            if (code != null && code >= 400) {
                throw Exception("Failed to start job: code ${code}. Message: ${startJobResponse.message}")
            }
        }

        return@runBlocking insertedTestRun
    }

    fun createTestRunForJob(request: StartTestRunRequest): TestRun = runBlocking {
        testRunCollection.updateOne(
            TestRun::cicdJobId eq request.cicdJobId,
            combine(
                setOnInsert(
                    TestRun::testRunId, currentEpoch().toString()
                ),
                setOnInsert(
                    TestRun::timeMetrics / TestRunTimeMetrics::created, currentDateTimeUtc()
                ),
                setOnInsert(
                    TestRun::status,  TestRunStatus.CREATED.status
                ),
                setOnInsert(
                    TestRun::project, request.project,
                ),
                setOnInsert(
                    TestRun::params, request.params,
                )
            ),
            upsert()
        )

        return@runBlocking testRunCollection.find(TestRun::cicdJobId eq request.cicdJobId).toList().first()
    }

    private fun startTestRunInTms(project: String): String? {
        return try {
            val prjTmsInt = projectIntegrationsService
                .getProjectTmsInt(project)

            val taskTrackerService = prjTmsInt.tmsInfo?.tmsService()

            taskTrackerService?.startTestrun(prjTmsInt.projectTmsInfo!!.project)
        } catch (e: Exception) {
            null
        }
    }

    fun startTestRun(request: StartTestRunRequest) = runBlocking {
        var testRun: TestRun = if (request.testRunId?.isNotEmpty() == true) {
                getTestRun(request.testRunId!!)!!
            } else if (request.cicdJobId?.isNotEmpty() == true) {
                testRunCollection.findOne(TestRun::cicdJobId eq request.cicdJobId)?: createTestRunForJob(request)
            } else {
                createTestRun(request, false)
            }

        val startDate = currentDateTimeUtc()
        val runner = TestRunRunner(
            name = request.runner ?: "Runner ${testRun.runners.size + 1}",
            simulators = request.simulators,
            started = startDate
        )

        val notStarted = testRun.startedByRunner == null
        //To make sure that no runners will start the same testrun and double the test queue and test results
        if (notStarted) {
            testRunCollection.updateOne(
                and(
                    TestRun::testRunId eq testRun.testRunId,
                    TestRun::startedByRunner eq null
                ),
                set(
                    TestRun::startedByRunner setTo runner.name
                )
            )
        }

        testRun = getTestRun(testRun.testRunId)!!
        if (testRun.startedByRunner == runner.name) {
            testRun.allureLaunchId = startTestRunInTms(testRun.project)
            testRun.status = TestRunStatus.PROCESSING.status
            testRun.timeMetrics.started = startDate
            testRun.config = request.config
            testRun.tests = TestRunTests(testsCount = request.testList.size, 0, 0)
            testRun.cicdJobId = request.cicdJobId

            testRunCollection.updateOne(
                TestRun::testRunId eq testRun.testRunId,
                combine(
                    set(
                        *(testRun.setCurrentPropertyValues(skipProperties = listOf("_id", "params", "testRunId", "runners", "projectId")))
                    ),
                    push(TestRun::runners, runner)
                )
            )

            testQueueCollection.updateOne(
                TestQueue::testRunId eq testRun.testRunId,
                TestQueue(testRunId = testRun.testRunId),
                upsert()
            )

            val updateTestResultRequests = request.testList.map {
                TestResult(
                    testRunId = testRun.testRunId,
                    testcaseId = it.testId,
                    project = testRun.project,
                    fullName = it.fullName,
                    status = TestStatus.WAITING.status,
                    title = it.title
                )
            }
            if (updateTestResultRequests.isNotEmpty()) {
                testResultsCollection.insertMany(updateTestResultRequests)
            }
        } else {
            testRunCollection.updateOne(
                TestRun::testRunId eq testRun.testRunId,
                push(TestRun::runners, runner)
            )
        }

        var retries = 0
        var result = getTestRun(testRun.testRunId)
        while (result?.status != TestRunStatus.PROCESSING.status && retries < 10) {
            delay(1000)
            retries += 1
            result = getTestRun(testRun.testRunId)
        }

        return@runBlocking result!!
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

        val nextTest = testResultsCollection.aggregate<TestResult>(
            match(
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
            ),
            sort(descending(TestResult::status)),
            limit(1)
        ).toList().firstOrNull()

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
                retry = nextTest.retries,
                title = nextTest.title
            )
        } else {
            leaveQueue(testRunId, queueTicket)

            return@runBlocking NextTestResponse(
                nextTest = null,
                testId = null,
                retry = null,
                title = null
            )
        }
    }

    fun cancelRun(testRunId: String) {
        try {
            val testRun = getTestRun(testRunId)

            if (testRun?.cicdJobId != null) {
                val cicdInfo = projectIntegrationsService.getProjectCicdInt(testRun.project)

                val cicdService = cicdInfo.cicdInfo?.cicdService()

                cicdService?.stopJob(cicdInfo.projectCicdInfo!!, testRun.cicdJobId!!)
            }

        } finally {
            finishTestRun(testRunId = testRunId, canceled = true)
        }
    }

    fun startJob(testRun: TestRun, branch: String): StartJobResponse? {
        val cicdInfo = projectIntegrationsService.getProjectCicdInt(testRun.project)
        val cicdService = cicdInfo.cicdInfo?.cicdService()

        val paramsMap = mutableMapOf<String, String>()
        testRun.params.forEach {
            paramsMap[it.name] = it.value
        }
        paramsMap["TEST_RUN_ID"] = testRun.testRunId

        return cicdService?.startJob(
            cicdInfo.projectCicdInfo!!,
            cicdInfo.projectCicdInfo.jobId,
            StartJobRequest(
                gitRef = branch,
                params = paramsMap
            )
        )
    }

    private fun finishTestRun(
        testRunId: String,
        hasError: Boolean = false,
        canceled: Boolean = false
    ): TestRun = runBlocking {
        var testRun = getTestRun(testRunId)!!

        val testsCount = testResultsService.getActualTestsCount(testRunId)
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

        launch {
            notifyTestRunFinished(testRun)
        }

        return@runBlocking testRun
    }

    fun notifyTestRunFinished(testRun: TestRun) {
        val integrations = projectIntegrationsService.getProjectOtherInts(testRun.project)
        val slackInt = integrations.firstOrNull { it.type == OtherIntegrationTypes.SLACK.type}

        slackInt?.let {
            val token = it.intInfo["token"]
            val channel = it.intInfo["channel"]

            if (!token.isNullOrBlank() && !channel.isNullOrBlank()) {
                val attachments = mutableListOf<Attachment>()

                val frontendBaseUrl = System.getenv("REMOTE_FRONTEND_BASE_URL") ?: "http://localhost:3000"
                val testRunUrl = "$frontendBaseUrl/projects/${testRun.project}/testRuns/${testRun.testRunId}"

                val blocks = mutableListOf<LayoutBlock>()
                val titleBlock = SectionBlock()
                val text = MarkdownTextObject()
                text.text = "*${testRun.project}:* Testrun *<$testRunUrl|${testRun.testRunId}>* on branch *${testRun.config?.branch ?: "unknown"}* is finished"
                titleBlock.text = text
                blocks.add(titleBlock)

                val successAttachment = Attachment()
                successAttachment.authorName = "PASSED: ${testRun.tests.successCount}"
                successAttachment.color = "#36a64f"

                val failuresAttachment = Attachment()
                failuresAttachment.authorName = "FAILED: ${testRun.tests.failsCount}"
                failuresAttachment.color = "#FF0000"

                attachments.add(successAttachment)
                if ((testRun.tests.failsCount ?: 0) > 0) {
                    attachments.add(failuresAttachment)
                }

                SlackClient(token).sendComplexMessage(channel, null, blocks, attachments)
            }
        }
    }

    fun finishRunForRunner(
        testRunId: String,
        runnerHasError: Boolean = false,
        runner: String
    ): TestRun = runBlocking {
        val endDate = currentDateTimeUtc()

        testRunCollection.updateOne(
            and(TestRun::testRunId eq testRunId, TestRun::runners / TestRunRunner::name eq runner),
            set(
                TestRun::runners.posOp / TestRunRunner::finished setTo endDate,
                TestRun::runners.posOp / TestRunRunner::withError setTo runnerHasError
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

        testQueueCollection.deleteMany(
            TestQueue::testRunId eq testRunId
        )

        return@runBlocking testRun
    }

    fun startRerun(testRunId: String) = runBlocking {
        val testRun = testRunCollection.findOne(TestRun::testRunId eq testRunId)!!

        createTestRun(CreateTestRunRequest(
            testRun.project,
            testRun.config!!.branch,
            testRun.params
        ))
    }

    fun deleteTestRun(project: String, testRunId: String) = runBlocking {
        testRunCollection.deleteMany(TestRun::testRunId eq testRunId)
        testResultsCollection.deleteMany(TestResult::testRunId eq testRunId)
        testRetriesCollection.deleteMany(TestResultRetry::testRunId eq testRunId)
        testQueueCollection.deleteMany(TestQueue::testRunId eq testRunId)
        testLogsCollection.deleteMany(TestLogsService.TestLog::testRunId eq testRunId)
        testStepsCollection.deleteMany(TestStepsService.TestSteps::testRunId eq testRunId)
        testQaReviewsCollection.deleteMany(QaReview::testRunId eq testRunId)

        try {
            File("$imageDir/testruns/$project/$testRunId").deleteRecursively()
        } catch (e: Exception) {
            logger.warn("Failed to delete attachments for testrun $testRunId: ${e.message}")
        }
    }

    fun getOldTestRuns(maxDays: Int): List<TestRun> = runBlocking {
        return@runBlocking testRunCollection.find(
            TestRun::timeMetrics / TestRunTimeMetrics::started lt ZonedDateTime.now().minusDays(maxDays.toLong()).toString()
        ).toList()
    }

    data class ClearResponse(
        var deleted: Int,
        var errors: Int,
        var failedTestRuns: List<String>
    )
    fun deleteOldTestRuns(maxDays: Int): ClearResponse {
        var deleted = 0
        var errors = 0
        val failedTestRuns = mutableListOf<String>()

        getOldTestRuns(maxDays).forEach {
            try {
                deleteTestRun(project = it.project, testRunId = it.testRunId)
                deleted += 1
            } catch (e: Exception) {
                logger.warn("Failed to delete testrun ${it.testRunId} in project ${it.project}")
                errors += 1
                failedTestRuns.add(it.testRunId)
            }
        }

        return ClearResponse(deleted, errors, failedTestRuns)
    }
}