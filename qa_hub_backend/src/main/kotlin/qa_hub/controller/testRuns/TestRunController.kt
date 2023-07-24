package qa_hub.controller.testRuns

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.ClassPathResource
import org.springframework.web.bind.annotation.*
import qa_hub.entity.testRun.*
import qa_hub.service.testResults.TestResultsService
import qa_hub.service.TestRunService
import qa_hub.service.testResults.TestLogsService
import qa_hub.service.testResults.TestStepsService
import java.io.BufferedReader
import java.io.InputStreamReader
import java.time.ZoneOffset
import java.time.ZonedDateTime
import kotlin.random.Random


@RestController
@RequestMapping("/api/testRuns")
class TestRunController {
    @Autowired
    lateinit var testRunService: TestRunService

    @Autowired
    lateinit var testResultsService: TestResultsService

    @Autowired
    lateinit var testLogsService: TestLogsService

    @Autowired
    lateinit var testStepsService: TestStepsService
    @PostMapping("/{project}")
    fun getTestRuns(@PathVariable("project") project: String, @RequestBody filter: TestRunsRequest?): List<TestRun> {
        return testRunService.getTestRuns(project, filter?.filter)
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
    fun createDebugTestRun(@RequestParam(required = false, defaultValue = "10") testsCount: Int): List<String> {
        val logFile = ClassPathResource("debug/testlog_example.log")
        val logText = BufferedReader(InputStreamReader(logFile.inputStream)).readText()

        val stepsFile = ClassPathResource("debug/teststeps_example.txt")
        val stepsText = BufferedReader(InputStreamReader(stepsFile.inputStream)).readText()
        val stepsTypeToken = object : TypeToken<List<TestStepsService.TestStep>>() {}.type
        val steps: List<TestStepsService.TestStep> = Gson().fromJson(stepsText, stepsTypeToken)

        val measures = mutableListOf<String>()

        fun <T: Any?> measure(name: String, action: () -> T): T {
            val start = ZonedDateTime.now(ZoneOffset.UTC).toEpochSecond()
            val result = action()
            val end = ZonedDateTime.now(ZoneOffset.UTC).toEpochSecond()

            val time = end - start
            measures.add("${name}: ${time} ")

            return result
        }
        data class Runner(
            val name: String,
            val simulators: List<String>
        )

        val runners = listOf(
            Runner("Runner 1", listOf("0034468A-B653-4FD9-9D29-EF25302AB9C9", "55B2ABE2-3AC8-40A1-B5F6-4FFBBD059811")),
            Runner("Runner 2", listOf("0BE2A453-56F6-4735-982B-B5E97B1E5400", "AB32FAF0-CBEF-424D-BB36-DB5A34C93B89"))
        )

        val tags = listOf("Release", "Daily", "Regression", "Dev")

        val tests = mutableListOf<String>()
        repeat(testsCount) { index ->
            tests.add("TestTarget.TestClass.testMethod${index}")
        }
        val testList = tests.map{ TestListElement(fullName = it, testId = Random.nextInt(10000, 99999).toString()) }.toMutableList()

        val testRun = measure("CreateTestRun"){
            testRunService.createTestRun(CreateTestRunRequest("Lowkey"))
        }

        runners.forEach {
            measure("StartTestRun") {
                testRunService.startTestRun(
                    StartTestRunRequest(
                        project = testRun.project,
                        params = testRun.params,
                        testRunId = testRun.testRunId,
                        testList = testList,
                        tags = tags.shuffled().take(Random.nextInt(0, tags.size - 1)).toMutableList(),
                        runner = it.name,
                        simulators = it.simulators,
                        config = TestRunConfig(
                            branch = "TestBranch",
                            commit = "TestCommit",
                            environment = "test",
                            retries = 3,
                            parallelThreads = 2
                        )
                    )
                )
            }
        }

        var finish = false
        while(!finish) {
            val runner = runners.random()
            val simulator = runner.simulators.random()
            val status = listOf(TestStatus.SUCCESS, TestStatus.FAILURE).random()

            val nextTest = measure("GetNextTest") {
                testRunService.getNextTest(testRun.testRunId, simulator, runner.name)
            }

            finish = nextTest.nextTest == null

            nextTest.nextTest?.let {
                measure("UpdateTestResult") {
                    testResultsService.updateTestResult(
                        TestResult(
                            testRunId = testRun.testRunId,
                            testcaseId = nextTest.testId ?: "unknown",
                            project = testRun.project,
                            fullName = nextTest.nextTest ?: "unknown",
                            status = status.status,
                            deviceId = simulator,
                            device = "iPhone 12",
                            deviceRuntime = "iOS 16.3.1",
                            runner = runner.name,
                            duration = Random.nextDouble(300.0),
                            message = if (status.status == TestStatus.FAILURE.status) {
                                logText.take(Random.nextInt(20, 500))
                            } else null
                        )
                    )

                    testLogsService.insertTestLog(testRun.testRunId, nextTest.nextTest ?: "unknown", nextTest.retry!!, logText)
                    testStepsService.insertTestSteps(
                        TestStepsService.TestSteps(
                            testRun.testRunId, nextTest.nextTest ?: "unknown", nextTest.retry, steps
                        )
                    )
                }
            }
        }

        runners.forEach {
            measure("FinishTestRun") {
                testRunService.finishRunForRunner(
                    testRunId = testRun.testRunId,
                    runner = it.name
                )
            }
        }

        return measures
    }
}