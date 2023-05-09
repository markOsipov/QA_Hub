package qa_hub.controller

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/testRuns")
class TestRunController {
    data class TestRunRequestParam(
        val name: String,
        val value: String
    )
    data class TestRunRequest(
        val projectId: String,
        val params: List<TestRunRequestParam>
    )
    @PostMapping("/start")
    fun startNewTestRun(@RequestBody body: TestRunRequest): TestRunRequest {
        return body
    }
}