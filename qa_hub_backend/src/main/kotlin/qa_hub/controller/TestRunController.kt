package qa_hub.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import qa_hub.entity.testRun.CreateTestRunRequest
import qa_hub.entity.testRun.StartTestRunRequest
import qa_hub.entity.testRun.TestRun
import qa_hub.service.TestRunService

@RestController
@RequestMapping("/api/testRuns")
class TestRunController {
    @Autowired
    lateinit var testRunService: TestRunService

    @PostMapping("/create")
    fun createTestRun(@RequestBody body: CreateTestRunRequest): TestRun {
        return testRunService.createTestRun(body)
    }

    @PostMapping("/start")
    fun startTestRun(@RequestBody body: StartTestRunRequest): TestRun {
        return testRunService.startTestRun(body)
    }
}