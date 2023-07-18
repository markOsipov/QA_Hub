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

@Service
class ProjectService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private var lastProjectsUpdate: Long? = null
    private var projectsValue = listOf<Project>()
    val currentProjects: List<Project>
        get() {
            val currentTime = System.currentTimeMillis()
            if (lastProjectsUpdate == null || currentTime - lastProjectsUpdate!! > 15000) {
                projectsValue = getProjects()
                lastProjectsUpdate = currentTime
            }
            return projectsValue
        }

    private val projectsCollection by lazy {
        mongoClient.db.getCollection<Project>(PROJECTS.collectionName)
    }

    fun getProjects(): List<Project> = runBlocking {
        projectsCollection.find().toList()
    }

    fun getProject(projectName: String): Project? = runBlocking {
        projectsCollection.find(
            Project::name.eq(projectName)
        ).toList().firstOrNull()
    }

    fun upsertProject(project: Project) = runBlocking {
        projectsCollection.updateOneById(
            project._id!!,
            set(
                *(project.setCurrentPropertyValues(skipProperties = listOf("_id")))
            ),
            upsert()
        )

        return@runBlocking  projectsCollection.findOne(
            Project::name.eq(project.name)
        )!!
    }

    fun insertProject(project: Project) = runBlocking {
        val projects = getProjects()
        if (projects.firstOrNull { it.name == project.name } == null) {
            projectsCollection.insertOne(project)

            return@runBlocking projectsCollection.findOne(
                Project::name.eq(project.name)
            )!!
        } else {
            throw Exception("Project name is not unique")
        }
    }

    fun deleteProject(projectName: String): DeleteResult = runBlocking {
        projectsCollection.deleteOne(
            Project::name.eq(projectName)
        )
    }

    fun deleteAllProjects(): DeleteResult = runBlocking {
        projectsCollection.deleteMany()
    }
}