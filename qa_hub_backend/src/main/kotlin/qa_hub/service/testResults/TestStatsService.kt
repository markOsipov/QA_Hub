package qa_hub.service.testResults

import kotlinx.coroutines.runBlocking
import org.litote.kmongo.*
import org.litote.kmongo.coroutine.aggregate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.entity.testRun.*

@Service
class TestStatsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient


    private val testResultsCollection by lazy {
        mongoClient.db.getCollection<TestResult>(Collections.TEST_RESULTS.collectionName)
    }

    private val testRunsCollection by lazy {
        mongoClient.db.getCollection<TestRun>(Collections.TEST_RUNS.collectionName)
    }

    private fun getFilteredTestRuns(project: String, filter: TestResultsFilter?): List<TestRun> = runBlocking {
        val requestFilter = mutableListOf(TestRun::project eq project)

        filter?.branch?.let {
            requestFilter.add(TestRun::config / TestRunConfig::branch eq filter.branch)
        }

        filter?.tag?.let {
            requestFilter.add(TestRun::config / TestRunConfig::branch eq filter.branch)
        }

        val request = mutableListOf(
            match(
                *requestFilter.toTypedArray()
            )
        )

        filter?.takeLast?.let {
            request.add(limit(filter.takeLast))
        }

        request.add(sort(descending(TestRun::timeMetrics / TestRunTimeMetrics::created)))

        testRunsCollection.aggregate<TestRun>(request).toList()
    }

    fun getStatsForProject(request: TestStatsRequest): List<TestStats> = runBlocking {
        val filteredTestRuns = getFilteredTestRuns(request.project, request.filter)

        val pipeline: MutableList<String> = mutableListOf(
            """
                {
                    ${'$'}group: {
                        _id: "${'$'}fullName",
                        fullName: { ${'$'}first: "${'$'}fullName"},
                        results: { ${'$'}push: "${"$$"}ROOT" },
                        totalRuns: {${'$'}sum: 1},
                        avgDuration: { ${'$'}avg: "${'$'}duration"},
                        avgRetries: { ${'$'}avg: "${'$'}retries"},
                        successRuns : {
                             ${'$'}sum: {
                                 ${'$'}cond: {
                                    if: { ${'$'}eq: [ "${'$'}status", "SUCCESS" ] },
                                    then: 1,
                                    else: 0
                                }
                            } 
                        },
                        lastRun: {
                            ${'$'}max: "${'$'}testRunId"
                        },
                        lastSuccess: {
                            ${'$'}max: {
                               ${'$'}cond: {
                                   if: { ${'$'}eq: [ "${'$'}status", "SUCCESS" ] },
                                   then: "${'$'}testRunId",
                                   else: null
                               }
                           } 
                        }
                    }
                }
            """.trimIndent(),
            """
                {
                    ${'$'}addFields: {
                        "successRate" : {
                            "${'$'}divide": ["${'$'}successRuns", "${'$'}totalRuns"]
                        }
                    }
 	            }
            """.trimIndent()
        )
        request.sort?.let {
            pipeline.add(
                """
                    {
                        ${'$'}sort: {
                            ${request.sort.fieldName}: ${if (request.sort.isAscending) 1 else 0}
                        }
                    }
                """.trimIndent()
            )
        }

        request.pagination?.let {
            pipeline.add(
                """
                    {
                        ${'$'}skip: ${request.pagination.skip}
                    }
                """.trimIndent()
            )
            pipeline.add(
                """
                    {
                        ${'$'}limit: ${request.pagination.limit}
                    }
                """.trimIndent()
            )
        }

        val groupedTestResults = testResultsCollection.aggregate<TestStats>(*pipeline.toTypedArray()).toList()

        groupedTestResults.forEach { result ->
            result.lastRun = filteredTestRuns.firstOrNull { it.testRunId == result.lastRun }?.timeMetrics?.started
            result.lastSuccess = filteredTestRuns.firstOrNull { it.testRunId == result.lastSuccess }?.timeMetrics?.started
        }

        return@runBlocking groupedTestResults
    }
}