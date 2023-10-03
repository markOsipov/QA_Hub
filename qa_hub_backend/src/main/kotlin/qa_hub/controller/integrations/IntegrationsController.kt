package qa_hub.controller.integrations

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import qa_hub.service.integrations.other.slack.AbstractOtherIntegrationInfo
import qa_hub.service.integrations.other.slack.otherIntegrations
import qa_hub.service.utils.*

@RestController
@RequestMapping("/api/integrations")
class IntegrationsController {
    @Autowired
    lateinit var projectIntegrationsService: ProjectIntegrationsService

    data class ProjectIntegrations(
        val tmsInt: ProjectTmsIntegrationsInfo?,
        val cicdInt: ProjectCicdIntegrationsInfo?,
        val taskTrackerInt: ProjectTaskTrackerIntegrationsInfo?,
        val otherInts: ProjecOtherInts
    )

    data class ProjecOtherInts(
        val active: List<OtherIntegrationInfo> = listOf(),
        val all: List<AbstractOtherIntegrationInfo> = otherIntegrations
    )
    @GetMapping("/{project}")
    fun getAllProjectIntegrations(@PathVariable project: String): ProjectIntegrations {
        val cicd =  try {
            projectIntegrationsService.getProjectCicdInt(project)
        } catch (e: Exception) {
            null
        }

        val tms = try {
            projectIntegrationsService.getProjectTmsInt(project)
        } catch (e: Exception) {
            null
        }

        val taskTracker = try {
            projectIntegrationsService.getProjectTaskTrackerInt(project)
        } catch (e: Exception) {
            null
        }

        val other = try {
            projectIntegrationsService.getProjectOtherInts(project)
        } catch (e: Exception) {
            listOf()
        }

        return ProjectIntegrations(tms, cicd, taskTracker, ProjecOtherInts(other))
    }
}