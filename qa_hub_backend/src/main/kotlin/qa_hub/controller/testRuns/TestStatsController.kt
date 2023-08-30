package qa_hub.controller.testRuns

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import qa_hub.entity.testRun.TestHistory
import qa_hub.entity.testRun.TestHistoryRequest
import qa_hub.entity.testRun.TestStats
import qa_hub.entity.testRun.TestStatsRequest
import qa_hub.service.testResults.TestStatsService

@RestController
@RequestMapping("/api/stats")
class TestStatsController {

    @Autowired
    lateinit var testStatsService: TestStatsService

    @PostMapping("")
    fun getStatsForProject(@RequestBody request: TestStatsRequest): List<TestStats> {
        return testStatsService.getStatsForProject(request)
    }

    @PostMapping("/alt")
    fun getStatsForProjectAlt(@RequestBody request: TestStatsRequest): List<TestStats> {
        return testStatsService.getStatsForProjectAlt(request)
    }

    @PostMapping("/history")
    fun getTestHistory(@RequestBody request: TestHistoryRequest): TestHistory {
        return testStatsService.getTestHistory(request)
    }

}