package qa_hub.service

import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.utils.setCurrentPropertyValues
import qa_hub.entity.BlockedTest
import com.mongodb.client.result.UpdateResult
import kotlinx.coroutines.runBlocking
import org.bson.types.ObjectId
import org.litote.kmongo.*
import org.litote.kmongo.util.KMongoUtil.idFilterQuery
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.entity.Collections.BLOCKED_TESTS
import qa_hub.core.utils.DateTimeUtils.formatDate

@Service
class BlockedTestsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val blockedTestsCollection by lazy {
        mongoClient.db.getCollection<BlockedTest>(BLOCKED_TESTS.collectionName)
    }

    fun getBlockedTests(): List<BlockedTest> = runBlocking {
        blockedTestsCollection.find().toList()
    }

    fun getBlockedTestsForProject(project: String): List<BlockedTest> = runBlocking {
        blockedTestsCollection
            .find(BlockedTest::project.eq(project))
            .toList()
    }

    fun blockTest(blockedTest: BlockedTest): UpdateResult = runBlocking {
        blockedTest.blockDate = formatDate()

        blockedTestsCollection.updateOne(
            and(
                BlockedTest::project.eq(blockedTest.project),
                BlockedTest::fullName.eq(blockedTest.fullName)
            ),
            set(
                *(blockedTest.setCurrentPropertyValues(skipProperties = listOf("_id")))
            ),
            upsert()
        )
    }

    fun unblockTest(blockedTest: BlockedTest) = runBlocking {
        blockedTestsCollection.deleteOne(
            and(
                BlockedTest::project.eq(blockedTest.project),
                BlockedTest::fullName.eq(blockedTest.fullName)
            )
        )
    }

    fun unblockTest(fullName: String, project: String) = runBlocking {
        blockedTestsCollection.deleteOne(
            and(
                BlockedTest::project.eq(project),
                BlockedTest::fullName.eq(fullName)
            )
        )
    }

    fun unblockAll() = runBlocking {
        blockedTestsCollection.deleteMany()
    }

    fun editBlockedTest(blockedTest: BlockedTest) = runBlocking {
        val updateBson = if (blockedTest._id != null) {
            idFilterQuery(ObjectId(blockedTest._id ?: ""))
        } else {
            and(
                BlockedTest::project.eq(blockedTest.project),
                BlockedTest::fullName.eq(blockedTest.fullName)
            )
        }

        blockedTestsCollection.updateOne(
            updateBson,
            set(
                *(blockedTest.setCurrentPropertyValues(skipProperties = listOf("_id")))
            )
        )
    }
}