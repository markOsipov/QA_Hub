package qa_hub.controller

import qa_hub.entity.BlockedTest
import qa_hub.service.BlockedTestsService
import com.mongodb.client.result.DeleteResult
import com.mongodb.client.result.UpdateResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import qa_hub.entity.BlockedTestHistoryItem
import qa_hub.service.integrations.taskTrackers.TaskStatusResponse
import java.lang.Exception

@RestController
@RequestMapping("/api/blocker")
class BlockedTestsController {
    @Autowired
    lateinit var blockedTestsService: BlockedTestsService

    @GetMapping("")
    fun getBlockedTests(): List<BlockedTest> {
        return blockedTestsService.getBlockedTests()
    }

    @GetMapping("/{project}")
    fun getBlockedTestsForProject(
        @PathVariable project: String,
        @RequestParam("skipTrials", required = false, defaultValue = "false") skipTrials: Boolean,
        @RequestParam("team", required = false) team: String?
    ): List<BlockedTest> {
        return blockedTestsService.getBlockedTestsForProject(project, skipTrials, team)
    }

    @GetMapping("/history/{project}")
    fun getBlockedTestsHistoryForProject(
        @PathVariable project: String): List<BlockedTestHistoryItem> {
        return blockedTestsService.getBlockedTestsHistoryForProject(project)
    }

    @GetMapping("/{project}/taskStatus/{task}")
    fun getTaskStatus(
        @PathVariable project: String,
        @PathVariable task: String
    ): TaskStatusResponse? {
        return try {
            blockedTestsService.getTaskStatus(project, task)
        } catch (e: Exception) {
            null
        }
    }

    @PostMapping("/block")
    fun blockTest(@RequestBody body: BlockedTest): UpdateResult {
        return blockedTestsService.blockTest(body)
    }

    @PostMapping("/unblock")
    fun unblockTest(@RequestBody body: BlockedTest): DeleteResult {
        return blockedTestsService.unblockTest(body)
    }

    @PostMapping("/edit")
    fun editBlockedTest(@RequestBody body: BlockedTest): UpdateResult {
        return blockedTestsService.editBlockedTest(body)
    }


}