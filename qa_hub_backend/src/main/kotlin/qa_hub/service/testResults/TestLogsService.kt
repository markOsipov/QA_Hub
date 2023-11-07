package qa_hub.service.testResults

import com.mongodb.client.model.Filters.and
import com.mongodb.client.result.InsertOneResult
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.eq
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import java.io.BufferedReader
import java.io.InputStreamReader

@Service
class TestLogsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val testLogsCollection by lazy {
        mongoClient.db.getCollection<TestLog>(Collections.TEST_LOGS.collectionName)
    }

    private val appLogsCollection by lazy {
        mongoClient.db.getCollection<TestLog>(Collections.APP_LOGS.collectionName)
    }

    fun getTestLog(
        testRunId: String,
        fullName: String,
        retry: Int
    ): TestLog? = runBlocking {
        testLogsCollection.findOne(
            and(
                TestLog::testRunId eq testRunId,
                TestLog::fullName eq fullName,
                TestLog::retry eq retry
            )
        )
    }

    fun getAppLog(
        testRunId: String,
        fullName: String,
        retry: Int
    ): TestLog? = runBlocking {
        appLogsCollection.findOne(
            and(
                TestLog::testRunId eq testRunId,
                TestLog::fullName eq fullName,
                TestLog::retry eq retry
            )
        )
    }
    fun insertTestLog(
        testRunId: String,
        fullName: String,
        retry: Int,
        logFile: MultipartFile
    ): InsertOneResult = runBlocking {
        val text = BufferedReader(InputStreamReader(logFile.inputStream)).readText()

        testLogsCollection.insertOne(
            TestLog(testRunId, fullName, retry, text)
        )
    }

    fun insertAppLog(
        testRunId: String,
        fullName: String,
        retry: Int,
        logFile: MultipartFile
    ): InsertOneResult = runBlocking {
        val text = BufferedReader(InputStreamReader(logFile.inputStream)).readText()

        appLogsCollection.insertOne(
            TestLog(testRunId, fullName, retry, text)
        )
    }

    fun insertTestLog(
        testRunId: String,
        fullName: String,
        retry: Int,
        logText: String
    ): InsertOneResult = runBlocking {
        testLogsCollection.insertOne(
            TestLog(
                testRunId, fullName, retry, logText
            )
        )
    }
    data class TestLog(
        val testRunId: String,
        val fullName: String,
        val retry: Int = 0,
        val log: String
    )
}