package qa_hub.service

import kotlinx.coroutines.runBlocking
import org.litote.kmongo.*
import org.litote.kmongo.coroutine.aggregate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.core.mongo.utils.setCurrentPropertyValues
import qa_hub.core.utils.DateTimeUtils.currentDateTimeUtc
import qa_hub.entity.metrics.MainProjectMetric
import qa_hub.service.utils.ProjectIntegrationsService
import java.time.Instant
import java.time.temporal.ChronoUnit

@Service
class MetricService {
    @Autowired
    lateinit var projectIntegrationsService: ProjectIntegrationsService

    @Autowired
    lateinit var blockedTestsService: BlockedTestsService

    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val metricsMainCollection by lazy {
        mongoClient.db.getCollection<MainProjectMetric>(Collections.METRICS_MAIN.collectionName)
    }

    fun calculateMetrics(project: String): MainProjectMetric {
        val validStatuses = listOf("active", "actual", "draft")

        val date = Instant.parse( currentDateTimeUtc() )
            .truncatedTo( ChronoUnit.DAYS )
            .toString()

        val blockedTests = blockedTestsService.getBlockedTestsForProject(project, false).size
        var manualTests = 0
        var automatedTests = 0

        val tmsInt = projectIntegrationsService
            .getProjectTmsInt(project)

        val tmsService = tmsInt.tmsInfo?.tmsService()
        val tmsProject = tmsInt.projectTmsInfo?.project

        if (tmsService != null && tmsProject != null ) {
            val testcases = tmsService.getTestcases(tmsInt.projectTmsInfo.project).filter{ validStatuses.contains(it.status.lowercase()) }
            automatedTests = testcases.filter { it.automated }.size
            manualTests = testcases.size - automatedTests
        }

        return MainProjectMetric(
            project = project,
            date = date,
            auto = automatedTests,
            manual = manualTests,
            blocked = blockedTests
        )
    }

    fun saveProjectMetrics(project: String) = runBlocking {
        val metrics = calculateMetrics(project)
        metricsMainCollection.updateOne(
            and(
                MainProjectMetric::project eq project,
                MainProjectMetric::date eq metrics.date
            ),
            set(*metrics.setCurrentPropertyValues(listOf("date"))),
            upsert()
        )

        return@runBlocking metrics
    }
    fun getMetrics(project: String): List<MainProjectMetric> = runBlocking {
        return@runBlocking metricsMainCollection.aggregate<MainProjectMetric> (
            match(  MainProjectMetric::project eq project),
            sort(ascending(MainProjectMetric::date))
        ).toList()
    }
}