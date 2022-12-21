package qa_hub.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import qa_hub.entity.Project
import qa_hub.service.ProjectService

@RestController
@RequestMapping("/api/projects")
class ProjectController {
    @Autowired
    lateinit var projectService: ProjectService

    @GetMapping("")
    fun getConfig(): List<Project> {
        return projectService.getProjects()
    }
}