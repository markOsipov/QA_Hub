package qa_hub.controller.testRuns

import com.mongodb.client.result.InsertOneResult
import com.mongodb.client.result.UpdateResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import qa_hub.entity.testRun.*
import qa_hub.service.testResults.QaReviewService
import qa_hub.service.testResults.TestLogsService
import qa_hub.service.testResults.TestResultsService
import qa_hub.service.testResults.TestStepsService

@RestController
@RequestMapping("/api/testResults")
class TestResultsController {
    @Autowired
    lateinit var testResultsService: TestResultsService

    @Autowired
    lateinit var testLogsService: TestLogsService

    @Autowired
    lateinit var testStepsService: TestStepsService

    @Autowired
    lateinit var qaReviewService: QaReviewService
    @PostMapping("/{testRunId}")
    fun getTestResults(
        @PathVariable("testRunId") testRunId: String,
        @RequestBody requestBody: TestResultsRequest? = null
    ): List<TestResult> {
        return testResultsService.findTestResults(testRunId, requestBody)
    }

    @PostMapping("/count/{testRunId}")
    fun countTestResults(
        @PathVariable("testRunId") testRunId: String,
        @RequestBody requestBody: TestResultFilter? = null
    ): TestResultsService.CountResponse {
        return testResultsService.countTestResults(testRunId, requestBody)
    }

    @PostMapping("/single")
    fun getTestResult(
        @RequestBody requestBody: SingleTestResultRequest
    ): TestResult? {
        return testResultsService.findSingleResult(requestBody.testRunId, requestBody.identifier)
    }

    @GetMapping("/retries")
    fun getTestRetries(@RequestParam testRunId: String, @RequestParam fullName: String): List<TestResultRetry> {
        return testResultsService.findTestRetries(testRunId, fullName)
    }

    @PostMapping("")
    fun postTestResult(@RequestBody body: TestResult): UpdateResult {
        return testResultsService.updateTestResult(body)
    }

    @PostMapping("/log")
    fun postTestLog(
        @RequestParam("file") file: MultipartFile,
        @RequestParam("testRunId") testRunId: String,
        @RequestParam("fullName") fullName: String,
        @RequestParam("retry", required = false, defaultValue = "1") retry: Int,
    ): InsertOneResult {
        return testLogsService.insertTestLog(testRunId, fullName, retry, file)
    }

    @GetMapping("/log")
    fun getTestLog(
        @RequestParam("testRunId") testRunId: String,
        @RequestParam("fullName") fullName: String,
        @RequestParam("retry", required = false, defaultValue = "1") retry: Int,
    ): TestLogsService.TestLog? {
        return testLogsService.getLog(testRunId, fullName, retry)
    }

    @PostMapping("/steps")
    fun postTestLog(
       @RequestBody body: TestStepsService.TestSteps
    ): InsertOneResult {
        return testStepsService.insertTestSteps(body)
    }

    @GetMapping("/steps")
    fun getTestSteps(
        @RequestParam("testRunId") testRunId: String,
        @RequestParam("fullName") fullName: String,
        @RequestParam("retry", required = false, defaultValue = "1") retry: Int,
    ): TestStepsService.TestSteps? {
        return testStepsService.getSteps(testRunId, fullName, retry)
    }
    @PostMapping("/review")
    fun postTestReview(
        @RequestBody body: QaReview
    ): QaReview {
        return qaReviewService.updateQaReview(body)
    }

    @GetMapping("/review")
    fun getTestReview(
        @RequestParam("testRunId") testRunId: String,
        @RequestParam("fullName") fullName: String
    ): QaReview? {
        return qaReviewService.getQaReview(testRunId, fullName)
    }

    @GetMapping("/timeline/{testRunId}")
    fun getTimelineData(
        @PathVariable("testRunId") testRunId: String
    ): TestResultsService.TimelineData? {
        return testResultsService.getTestrunTimelineData(testRunId)
    }
}