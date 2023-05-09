package qa_hub.controller

import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import qa_hub.entity.test_run.TestRun
import qa_hub.entity.test_run.TestRunRequest
import qa_hub.service.TestRunService

@RestController
@RequestMapping("/api/testRuns")
class TestRunController {

    @Autowired
    lateinit var testRunService: TestRunService

    @PostMapping("/create")
    fun startNewTestRun(@RequestBody body: TestRunRequest): TestRun = runBlocking {
        return@runBlocking testRunService.createTestRun(body)
    }
}