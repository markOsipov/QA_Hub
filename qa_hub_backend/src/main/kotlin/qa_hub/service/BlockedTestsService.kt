package qa_hub.service

import com.mongodb.client.model.Sorts
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.utils.setCurrentPropertyValues
import com.mongodb.client.result.UpdateResult
import kotlinx.coroutines.runBlocking
import org.bson.types.ObjectId
import org.litote.kmongo.*
import org.litote.kmongo.util.KMongoUtil.idFilterQuery
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.entity.Collections.*
import qa_hub.core.utils.DateTimeUtils.currentDateTimeUtc
import qa_hub.entity.*
import qa_hub.service.integrations.taskTrackers.TaskStatusResponse
import qa_hub.service.utils.ProjectIntegrationsService
import qa_hub.service.utils.ProjectService

@Service
class BlockedTestsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    @Autowired
    lateinit var projectService: ProjectService

    @Autowired
    lateinit var projectIntegrationsService: ProjectIntegrationsService

    private val blockedTestsCollection by lazy {
        mongoClient.db.getCollection<BlockedTest>(BLOCKED_TESTS.collectionName)
    }

    private val blockedTestsHistoryCollection by lazy {
        mongoClient.db.getCollection<BlockedTestHistoryItem>(BLOCKED_TESTS_HISTORY.collectionName)
    }

    fun getBlockedTests(): List<BlockedTest> = runBlocking {
        blockedTestsCollection.find().toList()
    }

    fun getBlockedTestsForProject(project: String, skipTrials: Boolean = false, team: String? = null): List<BlockedTest> = runBlocking {
        val filter = mutableListOf(BlockedTest::project.eq(project))

        if (skipTrials) {
            filter.add(
                BlockedTest::allowTrialRuns eq false
            )
        }

        if (!team.isNullOrEmpty()) {
            filter.add(
                BlockedTest::team eq team
            )
        }

        blockedTestsCollection
            .find(*filter.toTypedArray())
            .toList()
    }

    fun getBlockedTestsHistoryForProject(project: String): List<BlockedTestHistoryItem> = runBlocking {
        blockedTestsHistoryCollection
            .find(BlockedTestHistoryItem::project eq project)
            .sort(Sorts.ascending("date"))
            .toList()
    }

    fun getTaskStatus(project: String, task: String): TaskStatusResponse? = runBlocking {
        val taskTrackerInfo = projectIntegrationsService
            .getProjectTaskTrackerInt(project)

        val taskTrackerService = taskTrackerInfo.taskTrackerInfo?.taskTrackerService()

        return@runBlocking taskTrackerService?.getTaskStatus(task)
    }

    fun blockTest(blockedTest: BlockedTest): UpdateResult = runBlocking {
        val blockDate = currentDateTimeUtc()
        blockedTest.blockDate = blockDate

        try {
            val separator = projectService.currentProjects.first { it.name == blockedTest.project }.separator
            blockedTest.shortName = blockedTest.fullName.substringAfterLast(separator)
        } catch (e: Exception) {
            throw Exception("Blocked test has wrong project name: ${blockedTest.project}")
        }

        val result = blockedTestsCollection.updateOne(
            and(
                BlockedTest::project.eq(blockedTest.project),
                BlockedTest::fullName.eq(blockedTest.fullName)
            ),
            set(
                *(blockedTest.setCurrentPropertyValues(skipProperties = listOf("_id")))
            ),
            upsert()
        )

        blockedTestsHistoryCollection.insertOne(
            BlockedTestHistoryItem(
                date = blockDate,
                event = BlockedTestHistoryEvent.BLOCK.event,
                project = blockedTest.project,
                blockedTest = blockedTest
            )
        )

        return@runBlocking result
    }

    fun unblockTest(blockedTest: BlockedTest) = runBlocking {
        val result = blockedTestsCollection.deleteOne(
            and(
                BlockedTest::project.eq(blockedTest.project),
                BlockedTest::fullName.eq(blockedTest.fullName)
            )
        )

        blockedTestsHistoryCollection.insertOne(
            BlockedTestHistoryItem(
                date = currentDateTimeUtc(),
                event = BlockedTestHistoryEvent.UNBLOCK.event,
                project = blockedTest.project,
                blockedTest = blockedTest
            )
        )

        return@runBlocking result
    }

    fun clearAll() = runBlocking {
        blockedTestsCollection.deleteMany()
        blockedTestsHistoryCollection.deleteMany()
    }

    fun editBlockedTest(blockedTest: BlockedTest) = runBlocking {
        val separator = projectService.getProject(blockedTest.project)?.separator ?: Platforms.DEFAULT.platform.separator
        val shortName = blockedTest.fullName.substringAfterLast(separator)
        blockedTest.shortName = shortName

        val updateBson = if (blockedTest._id != null) {
            idFilterQuery(ObjectId(blockedTest._id ?: ""))
        } else {
            and(
                BlockedTest::project.eq(blockedTest.project),
                BlockedTest::fullName.eq(blockedTest.fullName)
            )
        }

        val result = blockedTestsCollection.updateOne(
            updateBson,
            set(
                *(blockedTest.setCurrentPropertyValues(skipProperties = listOf("_id")))
            )
        )

        blockedTestsHistoryCollection.insertOne(
            BlockedTestHistoryItem(
                date = currentDateTimeUtc(),
                event = BlockedTestHistoryEvent.EDIT.event,
                project = blockedTest.project,
                blockedTest = blockedTest
            )
        )

        return@runBlocking result
    }
}