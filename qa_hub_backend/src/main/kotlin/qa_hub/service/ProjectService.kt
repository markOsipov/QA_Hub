package qa_hub.service

import com.mongodb.client.result.DeleteResult
import kotlinx.coroutines.runBlocking
import org.bson.types.ObjectId
import org.litote.kmongo.eq
import org.litote.kmongo.set
import org.litote.kmongo.setTo
import org.litote.kmongo.upsert
import org.litote.kmongo.util.idValue
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections.PROJECTS
import qa_hub.core.mongo.utils.setCurrentPropertyValues
import qa_hub.entity.Project
import qa_hub.entity.QaHubConfig

@Service
class ProjectService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val qaHubConfigCollection by lazy {
        mongoClient.db.getCollection<Project>(PROJECTS.collectionName)
    }

    fun getProjects(): List<Project> = runBlocking {
        qaHubConfigCollection.find().toList()
    }

    fun getProject(projectName: String): Project? = runBlocking {
        qaHubConfigCollection.find(
            Project::name.eq(projectName)
        ).toList().firstOrNull()
    }

    fun upsertConfig(project: Project) = runBlocking {
        qaHubConfigCollection.updateOneById(
            project._id!!,
            set(
                *(project.setCurrentPropertyValues(skipProperties = listOf("_id")))
            ),
            upsert()
        )
    }

    fun deleteProject(projectName: String): DeleteResult = runBlocking {
        qaHubConfigCollection.deleteOne(
            Project::name.eq(projectName)
        )
    }

    fun deleteAllProjects(): DeleteResult = runBlocking {
        qaHubConfigCollection.deleteMany()
    }
}