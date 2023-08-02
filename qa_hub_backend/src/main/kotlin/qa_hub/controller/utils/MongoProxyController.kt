package qa_hub.controller.utils

import com.mongodb.client.result.DeleteResult
import com.mongodb.client.result.UpdateResult
import org.bson.Document
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import qa_hub.service.utils.MongoProxyService
import qa_hub.service.utils.MongoProxyService.MongoRequest


@RestController
@RequestMapping("/api/mongo")
class MongoProxyController {
    @Autowired
    lateinit var mongoProxyService: MongoProxyService

    @PostMapping("/findOne")
    fun findOne(@RequestBody body: MongoRequest): Document? = mongoProxyService.findOne(body)

    @PostMapping("/findMany")
    fun findMany(@RequestBody body: MongoRequest): List<Document> = mongoProxyService.findMany(body)

    @PostMapping("/updateOne")
    fun updateOne(@RequestBody body: MongoRequest): UpdateResult = mongoProxyService.updateOne(body)

    @PostMapping("/updateMany")
    fun updateMany(@RequestBody body: MongoRequest): List<UpdateResult> = mongoProxyService.updateMany(body)

    @PostMapping("/deleteOne")
    fun deleteOne(@RequestBody body: MongoRequest): DeleteResult = mongoProxyService.deleteOne(body)

    @PostMapping("/deleteMany")
    fun deleteMany(@RequestBody body: MongoRequest): List<DeleteResult> = mongoProxyService.deleteMany(body)
}
