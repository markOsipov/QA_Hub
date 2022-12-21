package qa_hub.service

import com.mongodb.client.result.DeleteResult
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.eq
import org.litote.kmongo.set
import org.litote.kmongo.upsert
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

    fun upsertProject(project: Project) = runBlocking {
        qaHubConfigCollection.updateOne(
            Project::name.eq(project.name),
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