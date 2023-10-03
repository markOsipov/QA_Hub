package qa_hub.controller.testRuns

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.ClassPathResource
import org.springframework.web.bind.annotation.*
import qa_hub.core.utils.runParallel
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
    fun getTestRuns(@PathVariable("project") project: String, @RequestBody request: TestRunsRequest?): List<TestRun> {
        return testRunService.getTestRuns(project, request)
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

    @PostMapping("/rerun/{testRunId}")
    fun startRerun(@PathVariable testRunId: String) {
        testRunService.startRerun(testRunId)
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
        return testRunService.finishRunForRunner(testRunId = testRunId, runnerHasError = hasError, runner = runner)
    }

    @PostMapping("/delete/{testRunId}")
    fun deleteTestRun(@PathVariable testRunId: String) {
        testRunService.deleteTestRun(testRunId = testRunId)
    }

    @PostMapping("/createDebug")
    fun createDebugTestRun(
        @RequestParam(required = false, defaultValue = "10") testsCount: Int,
        @RequestParam(required = false, defaultValue = "2") runnersCount: Int,
        @RequestParam(required = false, defaultValue = "2") simulatorsCount: Int
    ): List<String> {
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
            measures.add("$name: $time")

            return result
        }
        data class Runner(
            val name: String,
            val simulators: List<String>
        )

        val runners = (1 ..runnersCount).toList().map { runner ->
            val simulators = (1 .. simulatorsCount).toList().map {simulator ->
                "0BE2A453-56F6-4735-982B-B5E97B1E54${runner}${simulator - 1}"
            }

            return@map Runner("Runner $runner", simulators)
        }


        val tags = listOf("Release", "Daily", "Regression", "Dev")

        val tests = mutableListOf<String>()
        repeat(testsCount) { index ->
            tests.add("TestTarget.TestClass.testMethod${index}")
        }
        val testList = tests.map{ TestListElement(fullName = it, testId = Random.nextInt(10000, 99999).toString()) }.toMutableList()

        val testRun = measure("CreateTestRun"){
            testRunService.createTestRun(CreateTestRunRequest("Lowkey", "dev"))
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
                            commit = "092d9b${Random.nextInt(0, 9)}",
                            environment = "test",
                            retries = 3,
                            parallelThreads = simulatorsCount
                        )
                    )
                )
            }
        }

        data class Worker(val runner: String, val simulator: String)
        val workers = mutableListOf<Worker>()
        runners.forEach { runner ->
            runner.simulators.forEach { simulator ->
                workers.add(Worker(runner.name, simulator))
            }
        }

        fun runTests(runner: String, simulator: String) {
            var finish = false
            while(!finish) {
                val status = listOf(TestStatus.SUCCESS, TestStatus.FAILURE).random()

                val nextTest = measure("GetNextTest") { runBlocking {
                        testRunService.getNextTest(testRun.testRunId, simulator, runner)
                    }
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
                                runner = runner,
                                duration = Random.nextDouble(300.0),
                                message = if (status.status == TestStatus.FAILURE.status) {
                                    logText.take(Random.nextInt(20, 500))
                                } else null
                            )
                        )


                        testLogsService.insertTestLog(
                            testRun.testRunId,
                            nextTest.nextTest ?: "unknown",
                            nextTest.retry!!,
                            logText
                        )
                        testStepsService.insertTestSteps(
                            TestStepsService.TestSteps(
                                testRun.testRunId, nextTest.nextTest ?: "unknown", nextTest.retry, steps
                            )
                        )
                    }
                }
            }
        }

        val actions = workers.map{{ runTests(it.runner, it.simulator) }}
        runParallel(actions)

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