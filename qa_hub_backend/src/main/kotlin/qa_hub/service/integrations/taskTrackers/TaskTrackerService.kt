package qa_hub.service.integrations.taskTrackers

import com.mongodb.client.result.DeleteResult
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.eq
import org.litote.kmongo.set
import org.litote.kmongo.upsert
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.core.mongo.utils.setCurrentPropertyValues

@Service
class TaskTrackerService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val taskTrackersIntegrationsCollection by lazy {
        mongoClient.db.getCollection<TaskTrackerInfo>(Collections.TASK_TRACKER_INTEGRATIONS.collectionName)
    }

    fun getTaskTrackerIntegrations(): List<TaskTrackerInfo> = runBlocking {
        taskTrackersIntegrationsCollection.find().toList()
    }

    fun addTaskTrackerIntegration(integration: TaskTrackerInfo): TaskTrackerInfo = runBlocking {
        val integrations = getTaskTrackerIntegrations()
        if (integrations.firstOrNull { it.type == integration.type } == null) {
            taskTrackersIntegrationsCollection.insertOne(integration)

            return@runBlocking taskTrackersIntegrationsCollection.findOne(
                TaskTrackerInfo::type.eq(integration.type)
            )!!
        } else {
            throw Exception("Integration type is not unique")
        }
    }

    fun updateTaskTrackerIntegration(integration: TaskTrackerInfo): TaskTrackerInfo = runBlocking {
        taskTrackersIntegrationsCollection.updateOneById(
            integration._id!!,
            set(
                *(integration.setCurrentPropertyValues(skipProperties = listOf("_id")))
            ),
            upsert()
        )

        return@runBlocking taskTrackersIntegrationsCollection.findOne(
            TaskTrackerInfo::type.eq(integration.type)
        )!!
    }

    fun deleteTaskTrackerIntegration(id: String): DeleteResult = runBlocking {
        taskTrackersIntegrationsCollection.deleteOne(
            TaskTrackerInfo::_id.eq(id)
        )
    }

    fun deleteAllTaskTrackerIntegrations(): DeleteResult = runBlocking {
        taskTrackersIntegrationsCollection.deleteMany()
    }
}