package com.github.mosipov.qa_hub.controller

import com.github.mosipov.qa_hub.entity.BlockedTest
import com.github.mosipov.qa_hub.service.BlockedTestsService
import com.mongodb.client.result.DeleteResult
import com.mongodb.client.result.UpdateResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

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
    fun getBlockedTestsForProject(@PathVariable project: String): List<BlockedTest> {
        return blockedTestsService.getBlockedTestsForProject(project)
    }

    @PostMapping("")
    fun blockTest(@RequestBody body: BlockedTest): UpdateResult {
        return blockedTestsService.blockTest(body)
    }

    @DeleteMapping("")
    fun unblockTest(@RequestBody body: BlockedTest): DeleteResult {
        return blockedTestsService.unblockTest(body)
    }

    @PutMapping("")
    fun editBlockedTest(@RequestBody body: BlockedTest): UpdateResult {
        return blockedTestsService.editBlockedTest(body)
    }
}