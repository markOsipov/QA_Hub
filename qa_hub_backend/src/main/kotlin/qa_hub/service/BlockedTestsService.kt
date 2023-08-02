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
import qa_hub.core.mongo.entity.Collections.*
import qa_hub.core.utils.DateTimeUtils.formatDate
import qa_hub.entity.Platforms
import qa_hub.entity.Project
import qa_hub.service.integrations.taskTrackers.TaskStatusResponse
import qa_hub.service.integrations.taskTrackers.TaskTrackerInfo

@Service
class BlockedTestsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    @Autowired
    lateinit var projectService: ProjectService

    private val blockedTestsCollection by lazy {
        mongoClient.db.getCollection<BlockedTest>(BLOCKED_TESTS.collectionName)
    }

    private val taskTrackerIntegrationCollection by lazy {
        mongoClient.db.getCollection<TaskTrackerInfo>(TASK_TRACKER_INTEGRATIONS.collectionName)
    }

    private val projectCollection by lazy {
        mongoClient.db.getCollection<Project>(PROJECTS.collectionName)
    }

    fun getBlockedTests(): List<BlockedTest> = runBlocking {
        blockedTestsCollection.find().toList()
    }

    fun getBlockedTestsForProject(project: String): List<BlockedTest> = runBlocking {
        blockedTestsCollection
            .find(BlockedTest::project.eq(project))
            .toList()
    }

    fun getTaskStatus(project: String, task: String): TaskStatusResponse? = runBlocking {
        val projectInfo = projectCollection.findOne(Project::name eq project)
        val taskTrackerService = taskTrackerIntegrationCollection
            .findOne(TaskTrackerInfo::type eq projectInfo?.taskTracker?.type)
            ?.getService()

        return@runBlocking taskTrackerService?.getTaskStatus(task)
    }

    fun blockTest(blockedTest: BlockedTest): UpdateResult = runBlocking {
        blockedTest.blockDate = formatDate()

        try {
            val separator = projectService.currentProjects.first { it.name == blockedTest.project }.separator
            blockedTest.shortName = blockedTest.fullName.substringAfterLast(separator)
        } catch (e: Exception) {
            throw Exception("Blocked test has wrong project name: ${blockedTest.project}")
        }

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

        blockedTestsCollection.updateOne(
            updateBson,
            set(
                *(blockedTest.setCurrentPropertyValues(skipProperties = listOf("_id")))
            )
        )
    }
}