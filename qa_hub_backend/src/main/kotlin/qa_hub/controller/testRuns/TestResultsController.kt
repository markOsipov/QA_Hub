package qa_hub.controller.testRuns

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import qa_hub.entity.testRun.TestResult
import qa_hub.entity.testRun.TestResultRetry
import qa_hub.service.TestResultsService

@RestController
@RequestMapping("/api/testResults")
class TestResultsController {
    @Autowired
    lateinit var testResultsService: TestResultsService

    @GetMapping("/{testRunId}")
    fun getTestResults(@PathVariable("testRunId") testRunId: String): List<TestResult> {
        return testResultsService.findTestResults(testRunId)
    }

    @GetMapping("/retries")
    fun getTestRetries(@RequestParam testRunId: String, @RequestParam fullName: String): List<TestResultRetry> {
        return testResultsService.findTestRetries(testRunId, fullName)
    }
}