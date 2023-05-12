package qa_hub.service

import kotlinx.coroutines.runBlocking
import org.litote.kmongo.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections.*
import qa_hub.core.utils.DateTimeUtils.getCurrentTimestamp
import qa_hub.entity.test_run.*
import qa_hub.entity.test_run.TestRunStatus.*


@Service
class TestRunService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    @Autowired
    lateinit var projectService: ProjectService

    private val testRunsCollection by lazy {
        mongoClient.db.getCollection<TestRun>(TEST_RUNS.collectionName)
    }

    private val testRunParamsCollection by lazy {
        mongoClient.db.getCollection<TestRunParams>(TEST_RUN_PARAMS.collectionName)
    }

    private val testRunHistoryCollection by lazy {
        mongoClient.db.getCollection<TestRunHistory>(TEST_RUN_HISTORY.collectionName)
    }

    private val testRunRunnersCollection by lazy {
        mongoClient.db.getCollection<TestRunRunners>(TEST_RUN_RUNNERS.collectionName)
    }

    private val testRunTestQueueCollection by lazy {
        mongoClient.db.getCollection<TestRunTestQueue>(TEST_RUN_TEST_QUEUE.collectionName)
    }

    private val testResultsCollection by lazy {
        mongoClient.db.getCollection<TestResult>(TEST_RESULTS.collectionName)
    }

    suspend fun createTestRun(createTestRunRequest: CreateTestRunRequest): TestRun {
        val currentTimeStamp = getCurrentTimestamp()
        val startDate = currentTimeStamp.toString()

        val newTestRun = TestRun(
            mainInfo = TestRunMainInfo(project = createTestRunRequest.project),
            startDate = startDate,
            status = CREATED.status
        )

        runBlocking {
            testRunsCollection.updateOne(
                TestRun::startDate.eq(startDate),
                newTestRun,
                upsert()
            )
        }

        val testRun = testRunsCollection.findOne(TestRun::startDate.eq(startDate))!!

        testRunHistoryCollection.updateOne(
            TestRunHistory::testRunId.eq(testRun._id!!),
            TestRunHistory(
                testRunId = testRun._id!!,
                startDate = startDate,
                history = listOf(
                    TestRunHistoryItem(CREATED.status, startDate)
                )
            ), upsert()
        )

        testRunParamsCollection.insertOne(
            TestRunParams(
                testRunId = testRun._id!!,
                params = createTestRunRequest.params
            )
        )

        val project = projectService.getProject(testRun.mainInfo.project)
        //TODO: CICD start job

        return testRun
    }

    fun startTestRun(startTestRunRequest: StartTestRunRequest): TestRun = runBlocking {
        val startDate = getCurrentTimestamp().toString()

        val createdTestRun = if (startTestRunRequest.testRunId.isNullOrEmpty()) {
            createTestRun(CreateTestRunRequest(startTestRunRequest.mainInfo.project, listOf()))
        } else {
            testRunsCollection.findOneById(startTestRunRequest.testRunId)!!
        }

        if (createdTestRun.status != PROCESSING.status) {

            testRunsCollection.updateOneById(
                createdTestRun._id!!,
                set(
                    TestRun::mainInfo.setTo(startTestRunRequest.mainInfo),
                    TestRun::status.setTo(PROCESSING.status)
                )
            )

            testRunHistoryCollection.updateOne(
                TestRunHistory::testRunId.eq(createdTestRun._id),
                addToSet(
                    TestRunHistory::history, TestRunHistoryItem(
                        PROCESSING.status, startDate
                    )
                )
            )

            //Inserting Test queue if there is no one
            startTestRunRequest.testList?.let {
                val existingQueue = testRunTestQueueCollection.findOne(TestRunTestQueue::testRunId.eq(createdTestRun._id))

                if (existingQueue == null) {
                    testRunTestQueueCollection.insertOne(
                        TestRunTestQueue(
                            createdTestRun._id!!,
                            startTestRunRequest.testList.toMutableList()
                        )
                    )
                }

                testResultsCollection.insertMany(
                    startTestRunRequest.testList.map{
                        TestResult(
                            testRunId = createdTestRun._id!!,
                            testcaseId = it.testcaseId,
                            fullName = it.fullName,
                            resultDate = startDate,
                            status = TestStatus.WAITING.value
                        )
                    }
                )
            }
        }

        //Inserting involved runner info
        startTestRunRequest.gitlabRunner?.let {
            testRunRunnersCollection.updateOne(
                TestRunRunners::testRunId.eq(createdTestRun._id),
                addToSet(
                    TestRunRunners::runners,
                    TestRunRunner(it,startDate)
                )
            )
        }

        return@runBlocking testRunsCollection.findOneById(createdTestRun._id!!)!!
    }
}