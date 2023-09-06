package qa_hub.controller.utils

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.web.bind.annotation.*
import qa_hub.entity.metrics.MainProjectMetric
import qa_hub.service.MetricService
import qa_hub.service.utils.ProjectService
import retrofit2.http.GET

@RestController
@RequestMapping("/api/metrics")
class MetricController {
    @Autowired
    lateinit var metricService: MetricService

    @Autowired
    lateinit var projectService: ProjectService

    @GetMapping("/main/{project}")
    fun getMetrics(@PathVariable project: String): List<MainProjectMetric> {
        return metricService.getMetrics(project)
    }

    @PostMapping("/main/{project}")
    fun updateMetrics(@PathVariable project: String): MainProjectMetric {
        return metricService.saveProjectMetrics(project)
    }

    @Scheduled(cron = "0 0 4 * * FRI")
    @GetMapping("/main/updateAll")
    fun calculateAllProjectsMetrics(): ResponseEntity<Any> {
        projectService.getProjects().forEach { project ->
            try {
                metricService.saveProjectMetrics(project.name)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        return ResponseEntity.ok(null)
    }
}