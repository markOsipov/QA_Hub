package qa_hub.service

import kotlinx.coroutines.runBlocking
import org.litote.kmongo.eq
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections.*
import qa_hub.entity.test_run.*
import qa_hub.entity.test_run.TestRunStatus.*
import java.time.LocalDateTime

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

    suspend fun createTestRun(testRunRequest: TestRunRequest): TestRun {
        val startDate = LocalDateTime.now().toString()

        val newTestRun = TestRun(
            project = testRunRequest.project,
            startDate = startDate,
            status = CREATED.status
        )

        runBlocking {
            testRunsCollection.insertOne(newTestRun)
        }

        val testRun = testRunsCollection.findOne(TestRun::startDate.eq(startDate))
        val testRunMongoId =  testRun?._id!!

        testRunHistoryCollection.insertOne(
            TestRunHistory(
                testRunMongoId = testRunMongoId,
                startDate = startDate,
                history = listOf(TestRunHistoryItem(
                    CREATED.status, startDate
                ))
            )
        )

        testRunParamsCollection.insertOne(
            TestRunParams(
                testRunMongoId = testRunMongoId,
                params = testRunRequest.params
            )
        )

        val project = projectService.getProject(testRun.project)
        //TODO: CICD start job

        return testRun
    }
}
