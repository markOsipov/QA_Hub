package qa_hub.service.testResults.testStats


import com.mongodb.client.model.Accumulators.last
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.coroutine.aggregate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import org.litote.kmongo.*
import qa_hub.entity.testRun.*

@Service
class GeneralStatsHelper {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    @Autowired
    lateinit var testRunFilterHelper: TestRunFilterHelper

    private val testResultsRetriesCollection by lazy {
        mongoClient.db.getCollection<TestResult>(Collections.TEST_RESULTS_RETRIES.collectionName)
    }

    private val testResultsCollection by lazy {
        mongoClient.db.getCollection<TestResult>(Collections.TEST_RESULTS.collectionName)
    }


    fun getTestResultFilter(request: TestStatsRequest, testRunIds: List<String>): String {
        val filters = mutableListOf(
            TestResult::testRunId `in` testRunIds,
            or(
                TestResult::status `in` TestStatus.finalStatuses,
                TestResultRetry::statusHistory / StatusHistoryItem::status `in` TestStatus.finalStatuses
            )
        )

        request.filter?.search?.let {
           filters.add(
               or(
                   TestResult::fullName regex Regex(request.filter.search, RegexOption.IGNORE_CASE),
                   TestResult::testcaseId regex Regex(request.filter.search, RegexOption.IGNORE_CASE)
               )
           )
        }

        return match(*filters.toTypedArray()).json
    }

    private fun getTestResultsGeneralStats(request: TestStatsRequest, testRunIds: List<String>): GeneralStats = runBlocking {
        val pipeline: MutableList<String> = mutableListOf(
            getTestResultFilter(request, testRunIds),
            """
                {
                    ${'$'}group: {
                        _id: "${'$'}fullName",
                        fullName: { ${'$'}first: "${'$'}fullName"},
                        testcaseId: { ${'$'}last: "${'$'}testcaseId"},                     
                        totalTestResults: {${'$'}sum: 1},
                        avgDuration: { ${'$'}avg: "${'$'}duration"},
                        avgRetries: { ${'$'}avg: "${'$'}retries"},
                        totalRetries: { ${'$'}sum: "${'$'}retries"},      
                        successTestResults : {
                             ${'$'}sum: {
                                 ${'$'}cond: {
                                    if: { ${'$'}eq: [ "${'$'}status", "SUCCESS" ] },
                                    then: 1,
                                    else: 0
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

        pipeline.add(
            """
                {
                    ${'$'}group: {
                        _id: "stats",
                        totalTests: {${'$'}sum: 1}
                        totalTestResults: {${'$'}sum: "${'$'}totalTestResults"},                       
                        successTestResults: {${'$'}sum: "${'$'}successTestResults"},
                        totalRetries: { ${'$'}sum: "${'$'}totalRetries"},                        
                        avgTestRetries: { ${'$'}avg: "${'$'}avgRetries"},
                    }
                }
            """.trimIndent()
        )
        pipeline.add(
            """
                {
                    ${'$'}addFields: {
                        successTestResultRate: {
                            "${'$'}divide": ["${'$'}successTestResults", "${'$'}totalTestResults"]
                        }
                        "successTestRetryRate": {
                            "${'$'}divide": ["${'$'}successTestResults", "${'$'}totalRetries"]
                        }
                    }
 	            }
            """.trimIndent()
        )
        println(pipeline)
        val generalStats = testResultsCollection.aggregate<GeneralStats>(*pipeline.toTypedArray()).toList().first()

        return@runBlocking generalStats
    }

    private fun getTestResultsRetriesGeneralStats(request: TestStatsRequest, testRunIds: List<String>): GeneralStats = runBlocking {
        val pipeline: MutableList<String> = mutableListOf(
            getTestResultFilter(request, testRunIds),
            """
                {
                    ${'$'}addFields: {
                        finalStatus: { ${'$'}last: "${'$'}statusHistory"}
                    }
                }
            """.trimIndent(),
            """
                {
                    ${'$'}addFields: {
                        duration: "${'$'}finalStatus.duration"
                    }
                }
            """.trimIndent(),
            """
                {
                    ${'$'}match: {
                        duration: { ${'$'}ne: null}                            
                    }
                }
            """.trimIndent(),
            """
                {
                    ${'$'}group: {
                        _id: "stats",
                        avgRetryDuration: { ${'$'}avg: "${'$'}duration" }                        
                    }
                }
            """.trimIndent()
        )

        println(pipeline)
        val generalStats = testResultsRetriesCollection.aggregate<GeneralStats>(*pipeline.toTypedArray()).toList().first()

        return@runBlocking generalStats
    }

    fun getGeneralStats(request: TestStatsRequest): GeneralStats = runBlocking {
        val filteredTestRuns = testRunFilterHelper.getFilteredTestRuns(request.project, request.filter)
        val testRunIds = filteredTestRuns.map { it.testRunId }

        val generalStats = getTestResultsGeneralStats(request, testRunIds)
        val retryGeneralStats = getTestResultsRetriesGeneralStats(request, testRunIds)

        generalStats.avgRetryDuration = retryGeneralStats.avgRetryDuration

        return@runBlocking generalStats
    }
}