package qa_hub.controller

import com.mongodb.client.result.DeleteResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import qa_hub.entity.QaHubTestcase
import qa_hub.service.TestcaseService

@RestController
@RequestMapping("/api/testcases")
class TestcaseController {

    @Autowired
    lateinit var testcaseService: TestcaseService

    @GetMapping("/{project}")
    fun getTestcases(@PathVariable project: String): List<QaHubTestcase> {
        return testcaseService.getTestcases(project)
    }

    @GetMapping("/{testcaseId}")
    fun getTestcase(@PathVariable testcaseId: String): QaHubTestcase {
        return testcaseService.getTestcase(testcaseId)
    }

    @PostMapping("/insert")
    fun insertTestcase(@RequestBody body: QaHubTestcase): QaHubTestcase {
        return testcaseService.insertTestcase(body)
    }

    @PostMapping("/delete/{testcaseId}")
    fun insertTestcase(@PathVariable testcaseId: String): DeleteResult {
        return testcaseService.deleteTestcase(testcaseId)
    }
}