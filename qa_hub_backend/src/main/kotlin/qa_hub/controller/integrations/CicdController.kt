package qa_hub.controller.integrations

import com.mongodb.client.result.DeleteResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import qa_hub.service.integrations.cicd.CicdService
import qa_hub.service.integrations.cicd.CicdInfo
import qa_hub.service.integrations.cicd.CicdType
import qa_hub.service.integrations.cicd.CicdTypes
import qa_hub.service.utils.ProjectCicdIntegrationsInfo
import qa_hub.service.utils.ProjectIntegrationsService
import qa_hub.service.utils.ProjectTaskTrackerIntegrationsInfo


@RestController
@RequestMapping("/api/cicd")
class CicdController {
    @Autowired
    lateinit var cicdService: CicdService

    @Autowired
    lateinit var projectIntegrationsService: ProjectIntegrationsService

    @GetMapping("/types")
    fun getTmsTypes(): List<CicdType> {
        return CicdTypes.values().map {
            it.cicdType
        }
    }

    @GetMapping("/integrations")
    fun getTmsIntegrations(): List<CicdInfo> {
        return cicdService.getCicdIntegrations()
    }

    @PostMapping("/integrations/add")
    fun addTmsIntegration(@RequestBody body: CicdInfo): CicdInfo {
        return cicdService.addCicdIntegration(body)
    }

    @PostMapping("/integrations/update")
    fun updateTmsIntegration(@RequestBody body: CicdInfo): CicdInfo {
        return cicdService.updateCicdIntegration(body)
    }

    @PostMapping("/integrations/delete/{id}")
    fun deleteTmsIntegration(@PathVariable("id") id: String): DeleteResult {
        return cicdService.deleteCicdIntegration(id)
    }

    @GetMapping("/{project}")
    fun getProjectTaskTracker(@PathVariable project: String): ProjectCicdIntegrationsInfo? {
        return try {
            projectIntegrationsService.getProjectCicdInt(project)
        } catch (e: Exception) {
            null
        }
    }
}