package qa_hub.controller.utils

import com.mongodb.client.result.DeleteResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import qa_hub.entity.Project
import qa_hub.service.utils.CachedIntegrationInfoService
import qa_hub.service.utils.ProjectService

@RestController
@RequestMapping("/api/projects")
class ProjectController {
    @Autowired
    lateinit var projectService: ProjectService

    @Autowired
    lateinit var cachedInts: CachedIntegrationInfoService

    @GetMapping("")
    fun getProjects(): List<Project> {
        return projectService.getProjects()
    }

    @GetMapping("/{projectName}")
    fun getProject(@PathVariable projectName: String): Project? {
        return projectService.getProject(projectName)
    }

    @PostMapping("/{projectName}/delete")
    fun deleteProject(@PathVariable projectName: String): DeleteResult {
        cachedInts.clearProjectInts(projectName)
        return projectService.deleteProject(projectName)
    }

    @PostMapping("/create")
    fun createProject(@RequestBody body: Project): Project {
        return projectService.insertProject(body)
    }

    @PostMapping("/update")
    fun editProject(@RequestBody body: Project): Project {
        val project = projectService.upsertProject(body)
        cachedInts.clearProjectInts(project.name)

        return project
    }
}