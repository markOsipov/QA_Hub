package qa_hub.controller

import com.mongodb.client.result.DeleteResult
import com.mongodb.client.result.UpdateResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import qa_hub.core.utils.RandomUtils.getRandomString
import qa_hub.entity.BlockedTest
import qa_hub.entity.CoreConfigs.*
import qa_hub.entity.Platforms.*
import qa_hub.entity.Project
import qa_hub.entity.QaHubConfig
import qa_hub.entity.QaHubTestcase
import qa_hub.service.BlockedTestsService
import qa_hub.service.QaHubConfigService
import qa_hub.service.TestcaseService
import kotlin.random.Random
import kotlin.random.nextInt

@RestController
@RequestMapping("/api/config")
class QaHubConfigController {
    @Autowired
    lateinit var qaHubConfigService: QaHubConfigService

    @Autowired
    lateinit var blockedTestsService: BlockedTestsService

    @Autowired
    lateinit var testcaseService: TestcaseService

    @GetMapping("")
    fun getConfigs(): List<QaHubConfig> {
        return qaHubConfigService.getConfigs()
    }

    @GetMapping("/{configName}")
    fun getConfig(@PathVariable configName: String): QaHubConfig {
        return qaHubConfigService.getSpecificConfig(configName)
    }

    @PostMapping("/{configName}/delete")
    fun deleteConfig(@PathVariable configName: String): DeleteResult {
        return qaHubConfigService.deleteConfig(configName)
    }

    @PostMapping("/upsert")
    fun upsertConfig(@RequestBody body: QaHubConfig): UpdateResult {
        return qaHubConfigService.upsertConfig(body)
    }

    //Сброс конфигов и заполнение тестовых данных
    @PostMapping("/hardReset")
    fun hardReset() {
        val projects = listOf(
            Project(name = "qahub_example_ios", platform = IOS.platformName),
            Project(name = "qahub_example_android", platform = ANDROID.platformName),
            Project(name = "qahub_example_backend", platform = "backend")
        )

        val teams = listOf(
            "Sample_team_1", "Sample_team_1", "Sample_team_2"
        )

        qaHubConfigService.deleteAllConfigs()
        testcaseService.deleteAll()
        blockedTestsService.unblockAll()

        qaHubConfigService.upsertConfig(
            QaHubConfig(PROJECTS.configName, true, projects)
        )
        qaHubConfigService.upsertConfig(
            QaHubConfig(TEAMS.configName, true, teams)
        )

        projects.forEach { project ->
            repeat(10) {
                val testcase = testcaseService.insertTestcase(
                    QaHubTestcase( project = project.name, description = "Sample testcase", team = teams.random())
                )

                val shortName = "sampleTest${Random.nextInt(1..1000)}"
                val blockedTest = BlockedTest(
                    shortName = shortName,
                    fullName = "${project.platform.uppercase()}.some.package.sample.test.suite${project.separator}$shortName",
                    testcaseId = testcase.testcaseId,
                    jiraIssue = "INT-${Random.nextInt(1..1000)}",
                    project = testcase.project,
                    team = testcase.team
                )
                blockedTestsService.blockTest(blockedTest)
            }
        }
    }
}