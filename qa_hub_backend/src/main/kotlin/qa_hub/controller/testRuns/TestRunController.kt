package qa_hub.controller.testRuns

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import qa_hub.entity.testRun.*
import qa_hub.service.TestResultsService
import qa_hub.service.TestRunService
import kotlin.random.Random


@RestController
@RequestMapping("/api/testRuns")
class TestRunController {
    @Autowired
    lateinit var testRunService: TestRunService

    @Autowired
    lateinit var testResultsService: TestResultsService

    @GetMapping("/{project}")
    fun getTestRuns(@PathVariable("project") project: String): List<TestRun> {
        return testRunService.getTestRuns(project)
    }

    @GetMapping("")
    fun getTestRun(@RequestParam("id") testRunId: String): TestRun? {
        return testRunService.getTestRun(testRunId)
    }

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
                    @RequestParam("runner", required = false, defaultValue = "") runner: String
    ): NextTestResponse {

        return testRunService.getNextTest(testRunId, simulatorId, runner)
    }

    @PostMapping("/cancel/{testRunId}")
    fun cancelRun(@PathVariable testRunId: String) {
        testRunService.cancelRun(testRunId)
    }

    @PostMapping("/endRunner")
    fun endRunner(
        @RequestParam testRunId: String,
        @RequestParam(required = false, defaultValue = "false") hasError: Boolean,
        @RequestParam(required = false, defaultValue = "") runner: String
    ): TestRun {
        return testRunService.finishRunForRunner(testRunId = testRunId, hasError = hasError, runner = runner)
    }

    @PostMapping("/delete/{testRunId}")
    fun deleteTestRun(@PathVariable testRunId: String) {
        testRunService.deleteTestRun(testRunId = testRunId)
    }

    @PostMapping("/createDebug")
    fun createDebugTestRun(@RequestParam(required = false, defaultValue = "10") testsCount: Int): TestRun {
        data class Runner(
            val name: String,
            val simulators: List<String>
        )
        val runners = listOf(
            Runner("Runner 1", listOf("Simulator 1", "Simulator 2")),
            Runner("Runner 2", listOf("Simulator 3", "Simulator 4"))
        )

        val tests = mutableListOf<String>()
        repeat(testsCount) { index ->
            tests.add("TestTarget.TestClass.testMethod${index}")
        }
        val testList = tests.map{ TestListElement(fullName = it, testId = Random.nextInt(10000, 99999).toString()) }.toMutableList()

        val testRun = testRunService.createTestRun(CreateTestRunRequest("Lowkey"))

//        runners.forEach {
//            testRunService.startTestRun(
//                StartTestRunRequest(
//                    project = testRun.project,
//                    params = testRun.params,
//                    testRunId = testRun.testRunId,
//                    testList = testList,
//                    runner = it.name,
//                    simulators = it.simulators,
//                    config = TestRunConfig(
//                        branch = "TestBranch",
//                        commit = "TestCommit",
//                        environment = "test",
//                        retries = 3,
//                        parallelThreads = 2
//                    )
//                )
//            )
//        }
//
//        var finish = false
//        while(!finish) {
//            val runner = runners.random()
//            val simulator = runner.simulators.random()
//            val status = listOf(TestStatus.SUCCESS, TestStatus.FAILURE).random()
//
//            val nextTest = testRunService.getNextTest(testRun.testRunId, simulator, runner.name)
//            finish = nextTest.nextTest == null
//
//            nextTest.nextTest?.let {
//                testResultsService.updateTestResult(
//                    UpdateTestResultRequest(
//                        testRunId = testRun.testRunId,
//                        testcaseId = nextTest.testId ?: "unknown",
//                        project = testRun.project,
//                        fullName = nextTest.nextTest ?: "unknown",
//                        status = status.status,
//                        deviceUdid = simulator,
//                        device = "iPhone 12",
//                        deviceRuntime = "iOS 16.3.1",
//                        gitlabRunner = runner.name,
//                        message = if (status.status == TestStatus.FAILURE.status) {
//                            "Testing failure"
//                        } else null
//                    )
//                )
//            }
//        }
//
//        runners.forEach {
//            testRunService.finishRunForRunner(
//                testRunId = testRun.testRunId,
//                runner = it.name
//            )
//        }

        return testRunService.getTestRun(testRunId = testRun.testRunId)!!
    }
}