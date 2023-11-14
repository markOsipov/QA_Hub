package qa_hub.service.utils

import kotlinx.coroutines.runBlocking
import org.litote.kmongo.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections.*
import qa_hub.core.utils.DateTimeUtils.currentEpoch
import qa_hub.entity.Project
import qa_hub.service.integrations.cicd.CicdInfo
import qa_hub.service.integrations.taskTrackers.TaskTrackerInfo
import qa_hub.service.integrations.tms.TmsInfo

@Service
class ProjectIntegrationsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    @Autowired
    lateinit var cachedInsts: CachedIntegrationInfoService

    private val maxTimeSeconds = 1 * 10 * 60 //update every 10 min

    private val taskTrackerIntegrationsCollection by lazy {
        mongoClient.db.getCollection<TaskTrackerInfo>(TASK_TRACKER_INTEGRATIONS.collectionName)
    }

    private val cicdIntegrationsCollection by lazy {
        mongoClient.db.getCollection<CicdInfo>(CICD_INTEGRATIONS.collectionName)
    }

    private val tmsIntegrationsCollection by lazy {
        mongoClient.db.getCollection<TmsInfo>(TMS_INTEGRATIONS.collectionName)
    }

    private val otherIntegrationsCollection by lazy {
        mongoClient.db.getCollection<OtherIntegrationInfo>(OTHER_INTEGRATIONS.collectionName)
    }


    val projectCollection by lazy {
        mongoClient.db.getCollection<Project>(PROJECTS.collectionName)
    }

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

        cachedInsts.prjCicdInts[project] = projectIntegrationsInfo

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

        cachedInsts.prjTmsInts[project] = projectIntegrationsInfo

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

        cachedInsts.prjTtInts[project] = projectIntegrationsInfo

        return@runBlocking projectIntegrationsInfo
    }

    fun updateProjectOtherInts(project: String): ProjectOtherIntegrationsInfo = runBlocking {
        val projectInfo = projectCollection.findOne(Project::name eq project)

        val intInfo = projectInfo?.otherInts?.active ?: listOf()

        val info = ProjectOtherIntegrationsInfo(
            project = project,
            lastUpdate = currentEpoch(),
            intInfo = intInfo,
        )

        cachedInsts.prjOtherInts[project]= info

        return@runBlocking info
    }

    fun getProjectOtherInts(project: String): List<OtherIntegrationInfo> = runBlocking {
        val currentTime = currentEpoch()
        val existingInfo = cachedInsts.prjOtherInts[project]

        if (existingInfo != null && currentTime - existingInfo.lastUpdate <= maxTimeSeconds) {
            return@runBlocking existingInfo.intInfo
        } else {
            return@runBlocking updateProjectOtherInts(project).intInfo
        }
    }

    fun getProjectTaskTrackerInt(project: String): ProjectTaskTrackerIntegrationsInfo = runBlocking {
        val currentTime = currentEpoch()
        val existingInfo = cachedInsts.prjTtInts[project]

        if (existingInfo != null && currentTime - existingInfo.lastUpdate <= maxTimeSeconds) {
            return@runBlocking existingInfo
        } else {
            return@runBlocking updateProjectTaskTrackerIntegrationsInfo(project)
        }
    }

    fun getProjectCicdInt(project: String): ProjectCicdIntegrationsInfo = runBlocking {
        val currentTime = currentEpoch()
        val existingInfo = cachedInsts.prjCicdInts[project]

        if (existingInfo != null && currentTime - existingInfo.lastUpdate <= maxTimeSeconds) {
            return@runBlocking existingInfo
        } else {
            return@runBlocking updateProjectCicdIntegrationsInfo(project)
        }
    }

    fun getProjectTmsInt(project: String): ProjectTmsIntegrationsInfo = runBlocking {
        val currentTime = currentEpoch()
        val existingInfo = cachedInsts.prjTmsInts[project]

        if (existingInfo != null && currentTime - existingInfo.lastUpdate <= maxTimeSeconds) {
            return@runBlocking existingInfo
        } else {
            return@runBlocking updateProjectTmsIntegrationsInfo(project)
        }
    }
}