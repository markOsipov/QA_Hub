package qa_hub.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import qa_hub.entity.testRun.CreateTestRunRequest
import qa_hub.entity.testRun.NextTestResponse
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

    @GetMapping("/nextTest/{testRunId}")
    fun getNextTest(@PathVariable testRunId: String,
                    @RequestParam("simulatorId", required = false, defaultValue = "") simulatorId: String,
                    @RequestParam("gitlabRunner", required = false, defaultValue = "") gitlabRunner: String
    ): NextTestResponse {

        return testRunService.getNextTest(testRunId, simulatorId, gitlabRunner)
    }

    @PostMapping("/cancel/{testRunId}")
    fun cancelRun(@PathVariable testRunId: String) {
        testRunService.cancelRun(testRunId)
    }

    @PostMapping("/endRunner")
    fun endRunner(
        @RequestParam testRunId: String,
        @RequestParam(required = false, defaultValue = "false") finishedWithError: Boolean,
        @RequestParam(required = false, defaultValue = "") gitlabRunner: String
    ): TestRun {
        return testRunService.finishRunForRunner(testRunId = testRunId, finishedWithError = finishedWithError, runner = gitlabRunner)
    }
}