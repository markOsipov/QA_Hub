package qa_hub.service.testResults

import com.mongodb.client.model.Filters
import com.mongodb.client.result.InsertOneResult
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.eq
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections


@Service
class TestStepsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val testStepsCollection by lazy {
        mongoClient.db.getCollection<TestSteps>(Collections.TEST_STEPS.collectionName)
    }

    fun getSteps(
        testRunId: String,
        fullName: String,
        retry: Int
    ): TestSteps? = runBlocking {
        testStepsCollection.findOne(
            Filters.and(
                TestSteps::testRunId eq testRunId,
                TestSteps::fullName eq fullName,
                TestSteps::retry eq retry
            )
        )
    }

    fun insertTestSteps(
       testSteps: TestSteps
    ): InsertOneResult = runBlocking {
        testStepsCollection.insertOne(testSteps)
    }
    data class TestSteps(
        val testRunId: String,
        val fullName: String,
        val retry: Int,
        val steps: List<TestStep>
    )
    data class TestStep(
        var name: String,
        var id: String?,
        var parentId: String?,
        var steps: List<TestStep> = listOf(),
        var result: String,
    )
}