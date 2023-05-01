package qa_hub.controller

import com.mongodb.client.result.DeleteResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import qa_hub.service.tms.TmsService
import qa_hub.service.tms.entity.TmsInfo
import qa_hub.service.tms.entity.TmsType
import qa_hub.service.tms.entity.TmsTypes
import java.util.*

@RestController
@RequestMapping("/api/tms")
class TmsController {
    @Autowired
    lateinit var tmsService: TmsService

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

    @DeleteMapping("/integrations/delete/{id}")
    fun deleteTmsIntegration(@PathVariable("id") id: String): DeleteResult {
        return tmsService.deleteTmsIntegration(id)
    }
}
