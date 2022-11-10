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

@Service
class BlockedTestsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    val blockedTestsCollection by lazy {
        mongoClient.db.getCollection<BlockedTest>("blockedTests")
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
        blockedTestsCollection.updateOne(
            and(
                BlockedTest::project.eq(blockedTest.project),
                BlockedTest::fullName.eq(blockedTest.fullName)
            ),
            set(
                *(blockedTest.setCurrentPropertyValues())
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

    fun editBlockedTest(blockedTest: BlockedTest) = runBlocking {
        blockedTestsCollection.updateOne(
            or(
                idFilterQuery(ObjectId(blockedTest._id)),
                and(
                    BlockedTest::project.eq(blockedTest.project),
                    BlockedTest::fullName.eq(blockedTest.fullName)
                )
            ),
            set(
                *(blockedTest.setCurrentPropertyValues(skipProperties = listOf("_id")))
            )
        )
    }
}