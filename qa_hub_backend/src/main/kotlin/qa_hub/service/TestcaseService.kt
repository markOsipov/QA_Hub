package qa_hub.service

import com.mongodb.client.result.DeleteResult
import com.mongodb.client.result.InsertOneResult
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.eq
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections.TESTCASES
import qa_hub.entity.QaHubTestcase

@Service
class TestcaseService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val qaHubConfigCollection by lazy {
        mongoClient.db.getCollection<QaHubTestcase>(TESTCASES.collectionName)
    }

    fun getTestcases(project: String): List<QaHubTestcase> = runBlocking {
        qaHubConfigCollection.find(
            QaHubTestcase::project.eq(project)
        ).toList()
    }

    fun getTestcase(testcaseId: String): QaHubTestcase = runBlocking {
        qaHubConfigCollection.find(
            QaHubTestcase::testcaseId.eq(testcaseId)
        ).toList().first()
    }

    fun insertTestcase(testcase: QaHubTestcase): QaHubTestcase = runBlocking {
        if (testcase.testcaseId == null) {
            testcase.testcaseId = "${System.currentTimeMillis()}".drop(1).dropLast(3)
        }

        qaHubConfigCollection.insertOne(testcase)

        return@runBlocking testcase
    }

    fun deleteTestcase(testcaseId: String): DeleteResult = runBlocking {
        qaHubConfigCollection.deleteOne(
            QaHubTestcase::testcaseId.eq(testcaseId)
        )
    }

    fun deleteAll(): DeleteResult = runBlocking {
        qaHubConfigCollection.deleteMany()
    }
}