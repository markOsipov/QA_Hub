package qa_hub.controller.integrations

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import qa_hub.service.utils.ProjectCicdIntegrationsInfo
import qa_hub.service.utils.ProjectIntegrationsService
import qa_hub.service.utils.ProjectTaskTrackerIntegrationsInfo
import qa_hub.service.utils.ProjectTmsIntegrationsInfo

@RestController
@RequestMapping("/api/integrations")
class IntegrationsController {
    @Autowired
    lateinit var projectIntegrationsService: ProjectIntegrationsService

    data class ProjectIntegrations(
        val tmsInt: ProjectTmsIntegrationsInfo?,
        val cicdInt: ProjectCicdIntegrationsInfo?,
        val taskTrackerInt: ProjectTaskTrackerIntegrationsInfo?
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

        return ProjectIntegrations(tms, cicd, taskTracker)
    }
}