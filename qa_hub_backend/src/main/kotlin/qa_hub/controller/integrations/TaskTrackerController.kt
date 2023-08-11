package qa_hub.controller.integrations

import com.mongodb.client.result.DeleteResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import qa_hub.entity.Project
import qa_hub.service.integrations.taskTrackers.TaskTrackerInfo
import qa_hub.service.integrations.taskTrackers.TaskTrackerService
import qa_hub.service.integrations.taskTrackers.TaskTrackerType
import qa_hub.service.integrations.taskTrackers.TaskTrackerTypes
import qa_hub.service.utils.ProjectIntegrationsService
import qa_hub.service.utils.ProjectTaskTrackerIntegrationsInfo

@RestController
@RequestMapping("/api/taskTracker")
class TaskTrackerController {
    @Autowired
    lateinit var taskTrackerService: TaskTrackerService

    @Autowired
    lateinit var projectIntegrationsService: ProjectIntegrationsService

    @GetMapping("/types")
    fun getTmsTypes(): List<TaskTrackerType> {
        return TaskTrackerTypes.values().map {
            it.type
        }
    }

    @GetMapping("/integrations")
    fun getTmsIntegrations(): List<TaskTrackerInfo> {
        return taskTrackerService.getTaskTrackerIntegrations()
    }

    @PostMapping("/integrations/add")
    fun addTmsIntegration(@RequestBody body: TaskTrackerInfo): TaskTrackerInfo {
        return taskTrackerService.addTaskTrackerIntegration(body)
    }

    @PostMapping("/integrations/update")
    fun updateTmsIntegration(@RequestBody body: TaskTrackerInfo): TaskTrackerInfo {
        return taskTrackerService.updateTaskTrackerIntegration(body)
    }

    @PostMapping("/integrations/delete/{id}")
    fun deleteTmsIntegration(@PathVariable("id") id: String): DeleteResult {
        return taskTrackerService.deleteTaskTrackerIntegration(id)
    }

    @GetMapping("/{project}")
    fun getProjectTaskTracker(@PathVariable project: String): ProjectTaskTrackerIntegrationsInfo? {
        return try {
            projectIntegrationsService.getProjectTaskTrackerInt(project)
        } catch (e: Exception) {
            null
        }
    }
}