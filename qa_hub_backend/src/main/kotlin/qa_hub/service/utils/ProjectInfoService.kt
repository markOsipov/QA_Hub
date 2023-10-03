package qa_hub.service.utils

import kotlinx.coroutines.runBlocking
import org.litote.kmongo.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.core.utils.DateTimeUtils.currentEpoch
import qa_hub.entity.Project
import qa_hub.entity.ProjectCicdInfo
import qa_hub.entity.ProjectTmsInfo
import qa_hub.service.integrations.cicd.CicdInfo
import qa_hub.service.integrations.other.slack.AbstractOtherIntegrationInfo
import qa_hub.service.integrations.other.slack.otherIntegrations
import qa_hub.service.integrations.taskTrackers.TaskTrackerInfo
import qa_hub.service.integrations.tms.TmsInfo


data class ProjectTaskTrackerIntegrationsInfo(
    val project: String,
    val lastUpdate: Long,
    val taskTrackerInfo: TaskTrackerInfo?
)

data class ProjectCicdIntegrationsInfo(
    val project: String,
    val lastUpdate: Long,
    val projectCicdInfo: ProjectCicdInfo?,
    val cicdInfo: CicdInfo?,
)

data class ProjectTmsIntegrationsInfo(
    val project: String,
    val lastUpdate: Long,
    val projectTmsInfo: ProjectTmsInfo?,
    val tmsInfo: TmsInfo?
)

data class OtherIntegrationInfo(
    val project: String,
    val intInfo: Map<String, String>,
    override val type: String,
    override var projectFields: List<String>,
    override var sharedFields: List<String>
): AbstractOtherIntegrationInfo(type, projectFields, sharedFields)

@Service
class ProjectIntegrationsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val maxTimeSeconds = 1 * 10 * 60 //update every 10 min

    private val taskTrackerIntegrationsCollection by lazy {
        mongoClient.db.getCollection<TaskTrackerInfo>(Collections.TASK_TRACKER_INTEGRATIONS.collectionName)
    }

    private val cicdIntegrationsCollection by lazy {
        mongoClient.db.getCollection<CicdInfo>(Collections.CICD_INTEGRATIONS.collectionName)
    }

    private val tmsIntegrationsCollection by lazy {
        mongoClient.db.getCollection<TmsInfo>(Collections.TMS_INTEGRATIONS.collectionName)
    }

    private val otherIntegrationsCollection by lazy {
        mongoClient.db.getCollection<OtherIntegrationInfo>(Collections.OTHER_INTEGRATIONS.collectionName)
    }


    val projectCollection by lazy {
        mongoClient.db.getCollection<Project>(Collections.PROJECTS.collectionName)
    }

    private val projectsTmsIntegrations = mutableMapOf<String, ProjectTmsIntegrationsInfo>()
    private val projectsCicdIntegrations = mutableMapOf<String, ProjectCicdIntegrationsInfo>()
    private val projectsTaskTrackerIntegrations = mutableMapOf<String, ProjectTaskTrackerIntegrationsInfo>()
    fun updateProjectCicdIntegrationsInfo(project: String): ProjectCicdIntegrationsInfo = runBlocking {
        val projectInfo = projectCollection.findOne(Project::name eq project)

        val cicdInfo = cicdIntegrationsCollection
            .findOne(CicdInfo::cicdType eq projectInfo?.cicd?.type)

        val projectIntegrationsInfo = ProjectCicdIntegrationsInfo(
            project = project,
            lastUpdate = currentEpoch(),
            cicdInfo = cicdInfo,
            projectCicdInfo = projectInfo?.cicd
        )

        projectsCicdIntegrations[project] = projectIntegrationsInfo

        return@runBlocking projectIntegrationsInfo
    }

    fun updateProjectTmsIntegrationsInfo(project: String): ProjectTmsIntegrationsInfo = runBlocking {
        val projectInfo = projectCollection.findOne(Project::name eq project)

        val tmsInfo = tmsIntegrationsCollection
            .findOne(TmsInfo::tmsType eq projectInfo?.tms?.type)

        val projectIntegrationsInfo = ProjectTmsIntegrationsInfo(
            project = project,
            lastUpdate = currentEpoch(),
            tmsInfo = tmsInfo,
            projectTmsInfo = projectInfo?.tms
        )

        projectsTmsIntegrations[project] = projectIntegrationsInfo

        return@runBlocking projectIntegrationsInfo
    }

    fun updateProjectTaskTrackerIntegrationsInfo(project: String): ProjectTaskTrackerIntegrationsInfo = runBlocking {
        val projectInfo = projectCollection.findOne(Project::name eq project)

        val ttInfo = taskTrackerIntegrationsCollection
            .findOne(TaskTrackerInfo::type eq projectInfo?.taskTracker?.type)

        val projectIntegrationsInfo = ProjectTaskTrackerIntegrationsInfo(
            project = project,
            lastUpdate = currentEpoch(),
            taskTrackerInfo = ttInfo,
        )

        projectsTaskTrackerIntegrations[project] = projectIntegrationsInfo

        return@runBlocking projectIntegrationsInfo
    }

    fun getProjectOtherInts(project: String): List<OtherIntegrationInfo> = runBlocking {
        otherIntegrationsCollection.find(
            and(
                OtherIntegrationInfo::project eq project
            )
        ).toList()
    }

    fun updateProjectOtherInt(project: String, intType: String, info: Map<String, String>) = runBlocking {
        val int = otherIntegrations.firstOrNull{ it.type == intType }
        val projectFields = int?.projectFields ?: listOf()
        val sharedFields = int?.sharedFields ?: listOf()

        otherIntegrationsCollection.updateOne(
            and(
                OtherIntegrationInfo::project eq project,
                OtherIntegrationInfo::type eq intType
            ),
            set(
                OtherIntegrationInfo::intInfo setTo info,
                OtherIntegrationInfo::projectFields setTo projectFields,
                AbstractOtherIntegrationInfo::sharedFields setTo sharedFields
            ),
            upsert()
        )
    }

    fun removeProjectOtherInt(project: String, intType: String) = runBlocking {
        otherIntegrationsCollection.deleteMany(
            and(
                OtherIntegrationInfo::project eq project,
                OtherIntegrationInfo::type eq intType
            )
        )
    }

    fun getProjectTaskTrackerInt(project: String): ProjectTaskTrackerIntegrationsInfo = runBlocking {
        val currentTime = currentEpoch()
        val existingInfo = projectsTaskTrackerIntegrations[project]

        if (existingInfo != null && currentTime - existingInfo.lastUpdate <= maxTimeSeconds) {
            return@runBlocking existingInfo
        } else {
            return@runBlocking updateProjectTaskTrackerIntegrationsInfo(project)
        }
    }

    fun getProjectCicdInt(project: String): ProjectCicdIntegrationsInfo = runBlocking {
        val currentTime = currentEpoch()
        val existingInfo = projectsCicdIntegrations[project]

        if (existingInfo != null && currentTime - existingInfo.lastUpdate <= maxTimeSeconds) {
            return@runBlocking existingInfo
        } else {
            return@runBlocking updateProjectCicdIntegrationsInfo(project)
        }
    }

    fun getProjectTmsInt(project: String): ProjectTmsIntegrationsInfo = runBlocking {
        val currentTime = currentEpoch()
        val existingInfo = projectsTmsIntegrations[project]

        if (existingInfo != null && currentTime - existingInfo.lastUpdate <= maxTimeSeconds) {
            return@runBlocking existingInfo
        } else {
            return@runBlocking updateProjectTmsIntegrationsInfo(project)
        }
    }
}