package qa_hub.controller.integrations

import com.mongodb.client.result.DeleteResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import qa_hub.service.integrations.tms.TmsService
import qa_hub.service.integrations.tms.TmsInfo
import qa_hub.service.integrations.tms.TmsType
import qa_hub.service.integrations.tms.TmsTypes
import qa_hub.service.utils.ProjectIntegrationsService
import qa_hub.service.utils.ProjectTmsIntegrationsInfo
import java.util.*

@RestController
@RequestMapping("/api/tms")
class TmsController {
    @Autowired
    lateinit var tmsService: TmsService

    @Autowired
    lateinit var projectIntegrationsService: ProjectIntegrationsService

    @GetMapping("/types")
    fun getTmsTypes(): List<TmsType> {
        return TmsTypes.values().map {
            it.tmsType
        }
    }

    @GetMapping("/integrations")
    fun getTmsIntegrations(): List<TmsInfo> {
        return tmsService.getTmsIntegrations()
    }

    @PostMapping("/integrations/add")
    fun addTmsIntegration(@RequestBody body: TmsInfo): TmsInfo {
        return tmsService.addTmsIntegration(body)
    }

    @PostMapping("/integrations/update")
    fun updateTmsIntegration(@RequestBody body: TmsInfo): TmsInfo {
        return tmsService.updateTmsIntegration(body)
    }

    @PostMapping("/integrations/delete/{id}")
    fun deleteTmsIntegration(@PathVariable("id") id: String): DeleteResult {
        return tmsService.deleteTmsIntegration(id)
    }

    @GetMapping("/{project}")
    fun getProjectTms(@PathVariable project: String): ProjectTmsIntegrationsInfo? {
        return try {
            projectIntegrationsService.getProjectTmsInt(project)
        } catch (e: Exception) {
            null
        }
    }
}
