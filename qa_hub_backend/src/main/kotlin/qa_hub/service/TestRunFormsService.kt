package qa_hub.service

import com.mongodb.client.result.DeleteResult
import com.mongodb.client.result.UpdateResult
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.eq
import org.litote.kmongo.set
import org.litote.kmongo.setTo
import org.litote.kmongo.upsert
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections.TEST_RUN_FORMS
import qa_hub.entity.StartTestRunForm
import qa_hub.entity.TestRunFormParams
import qa_hub.service.utils.ProjectIntegrationsService

@Service
class TestRunFormsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    @Autowired
    lateinit var projectIntegrationsService: ProjectIntegrationsService

    private val testRunFormsCollection by lazy {
        mongoClient.db.getCollection<StartTestRunForm>(TEST_RUN_FORMS.collectionName)
    }
    fun upsertTestRunForms(startTestRunForm: StartTestRunForm): UpdateResult = runBlocking {
        val invalidParams = startTestRunForm.params
            .filter{ !TestRunFormParams.stringValues.contains(it.type) }
            .map { it.type }
        if (invalidParams.isNotEmpty()) {
            throw Exception("""Failed to upsert testRunForm for project: ${startTestRunForm.project}.
                | Next params have wrong type: $invalidParams.
                | Allowed param types: ${TestRunFormParams.stringValues}
            """.trimMargin())
        }

        testRunFormsCollection.updateOne(
            StartTestRunForm::project.eq(startTestRunForm.project),
            set(
                StartTestRunForm::params.setTo(startTestRunForm.params),
                StartTestRunForm::defaultBranch.setTo(startTestRunForm.defaultBranch)
            ),
            upsert()
        )
    }

    fun findTestRunForm(project: String): StartTestRunForm? = runBlocking {
        testRunFormsCollection.findOne(
            StartTestRunForm::project.eq(project)
        )
    }

    fun deleteTestRunForm(project: String): DeleteResult = runBlocking {
        testRunFormsCollection.deleteOne(
            StartTestRunForm::project.eq(project)
        )
    }

    fun getBranches(project: String): List<String> = runBlocking {
        val cicdInfo = projectIntegrationsService.getProjectCicdInt(project)

        val cicdService = cicdInfo.cicdInfo?.cicdService()

        return@runBlocking cicdService?.getBranches(cicdInfo.projectCicdInfo!!) ?: listOf()
    }
}