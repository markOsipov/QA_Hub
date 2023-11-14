package qa_hub.service.utils

import org.springframework.stereotype.Service
import qa_hub.entity.ProjectCicdInfo
import qa_hub.entity.ProjectTmsInfo
import qa_hub.service.integrations.cicd.CicdInfo
import qa_hub.service.integrations.other.slack.AbstractOtherIntegrationInfo
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

data class ProjectOtherIntegrationsInfo(
    val project: String,
    val lastUpdate: Long,
    val intInfo: List<OtherIntegrationInfo>,
)

data class OtherIntegrationInfo(
    val project: String,
    val intInfo: Map<String, String>,
    override val type: String,
    override var projectFields: List<String>,
    override var sharedFields: List<String>
): AbstractOtherIntegrationInfo(type, projectFields, sharedFields)
@Service
class CachedIntegrationInfoService {
    var prjTmsInts = mutableMapOf<String, ProjectTmsIntegrationsInfo>()
    var prjCicdInts = mutableMapOf<String, ProjectCicdIntegrationsInfo>()
    var prjTtInts = mutableMapOf<String, ProjectTaskTrackerIntegrationsInfo>()
    var prjOtherInts = mutableMapOf<String, ProjectOtherIntegrationsInfo>()

    fun clearProjectInts(project: String) {
        prjTmsInts.remove(project)
        prjCicdInts.remove(project)
        prjTtInts.remove(project)
        prjOtherInts.remove(project)
    }
}