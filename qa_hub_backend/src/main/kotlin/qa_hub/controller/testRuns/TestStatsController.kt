package qa_hub.controller.testRuns

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import qa_hub.entity.testRun.TestStats
import qa_hub.entity.testRun.TestStatsRequest
import qa_hub.service.testResults.TestStatsService

@RestController
@RequestMapping("/api/stats")
class TestStatsController {

    @Autowired
    lateinit var testStatsService: TestStatsService

    @GetMapping("")
    fun getStatsForProject(@RequestBody request: TestStatsRequest): List<TestStats> {
        return testStatsService.getStatsForProject(request)
    }
}