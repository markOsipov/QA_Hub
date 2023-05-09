package qa_hub.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import qa_hub.entity.StartTestRunForm
import qa_hub.entity.TestRunFormParams
import qa_hub.service.TestRunFormsService

@RestController
@RequestMapping("/api/testRunForms")
class TestRunFormsController {

    @Autowired
    lateinit var testRunFormsService: TestRunFormsService

    @GetMapping("/paramTypes")
    fun getParamTypes(): List<String> {
        return TestRunFormParams.stringValues
    }

    @GetMapping("/{project}")
    fun getTestRunForm(@PathVariable project: String): StartTestRunForm {
        return testRunFormsService.findTestRunForm(project) ?: StartTestRunForm(project = project, params = mutableListOf())
    }

    @PostMapping("/upsert")
    fun upsertTestRunForm(@RequestBody body: StartTestRunForm): ResponseEntity<*> {
        return ResponseEntity.ok(testRunFormsService.upsertTestRunForms(body))
    }

    @PostMapping("/delete")
    fun deleteTestRunForm(@RequestBody body: StartTestRunForm): ResponseEntity<*> {
        return ResponseEntity.ok(testRunFormsService.upsertTestRunForms(body))
    }
}