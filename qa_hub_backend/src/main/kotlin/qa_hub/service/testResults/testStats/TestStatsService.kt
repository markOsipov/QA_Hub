package qa_hub.service.testResults.testStats

import com.mongodb.client.model.Sorts
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

    @Autowired
    lateinit var testRunFilterHelper: TestRunFilterHelper

    @Autowired
    lateinit var generalStatsHelper: GeneralStatsHelper

    private val testResultsCollection by lazy {
        mongoClient.db.getCollection<TestResult>(Collections.TEST_RESULTS.collectionName)
    }

    fun getGeneralStats(request: TestStatsRequest): GeneralStats = runBlocking {
        generalStatsHelper.getGeneralStats(request)
    }

    fun getStatsForProject(request: TestStatsRequest): List<TestStats> = runBlocking {
        val filteredTestRuns = testRunFilterHelper.getFilteredTestRuns(request.project, request.filter)
        val testRunIds = filteredTestRuns.map{ it.testRunId }

        //default kmongo functions have bugs + do not support some of mongo operators
        val pipeline: MutableList<String> = mutableListOf(
            generalStatsHelper.getTestResultFilter(request, testRunIds),
            """
                {
                    ${'$'}group: {
                        _id: "${'$'}fullName",
                        fullName: { ${'$'}first: "${'$'}fullName"},
                        testcaseId: { ${'$'}last: "${'$'}testcaseId"},
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
                            ${'$'}max: "${'$'}endDate"
                        },
                        lastSuccess: {
                            ${'$'}max: {
                               ${'$'}cond: {
                                   if: { ${'$'}eq: [ "${'$'}status", "SUCCESS" ] },
                                   then: "${'$'}endDate",
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
                            ${request.sort.fieldName}: ${if (request.sort.isAscending) 1 else -1}
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
        println(pipeline)

        return@runBlocking testResultsCollection.aggregate<TestStats>(*pipeline.toTypedArray()).toList()
    }

        fun getStatsForProjectAlt(request: TestStatsRequest): List<TestStats> = runBlocking {
        val testRunIds = testRunFilterHelper.getFilteredTestRuns(request.project, request.filter)
            .map{ it.testRunId }

        val pipeline = mutableListOf(
            match(
                and (
                    TestResult::testRunId `in` testRunIds,
                    TestResult::status `in` TestStatus.finalStatuses
                )
            ),
            sort(
                descending(TestResult::endDate, TestResult::testRunId)
            ),
        )

        request.sort?.let {
            pipeline.add(
                if (request.sort.isAscending) {
                    Sorts.descending(request.sort.fieldName)
                } else {
                    Sorts.ascending(request.sort.fieldName)
                }
            )
        }

        request.pagination?.let {
            pipeline.addAll(
               listOf(
                   skip(request.pagination.skip),
                   limit(request.pagination.limit)
               )
            )
        }

        val testResults = testResultsCollection.aggregate<TestResult>(*pipeline.toTypedArray()).toList()

        val testStats = mutableListOf<TestStats>()
        testResults
            .groupBy { it.fullName }
            .forEach { (fullName, testResultsList) ->
                testStats.add(
                    calculateTestStats(fullName, testResultsList)
                )
            }

        return@runBlocking testStats
    }

    private fun calculateTestStats(fullName: String, testResults: List<TestResult>): TestStats {
        val totalRuns = testResults.size
        val successRuns = testResults.count{ it.status == TestStatus.SUCCESS.status }
        val successRate = successRuns.toDouble()  / testResults.size.toDouble()

        val avgDuration = (testResults.sumOf { it.duration ?: 0.0 } / testResults.count { it.duration != null }).toInt()
        val avgRetries = testResults.sumOf { it.retries }.toDouble() / testResults.count { it.retries > 0 }.toDouble()

        val sortedResults = testResults.sortedByDescending { it.testRunId }
        val lastRun = sortedResults.first().endDate
        val lastSuccess = sortedResults.firstOrNull { it.status == TestStatus.SUCCESS.status }?.endDate

       return TestStats(
            fullName = fullName,
            totalRuns = totalRuns,
            successRuns = successRuns,
            successRate = successRate,
            avgDuration = avgDuration,
            avgRetries = avgRetries,
            lastRun = lastRun,
            lastSuccess = lastSuccess
        )
    }

    fun getTestHistory(request: TestHistoryRequest): SingleTestStats? = runBlocking {
        val takeLast = (request.filter?.takeLast ?: 0) + 0
        val filter = request.filter
        filter?.let{
            filter.takeLast = null
        }
        val testRunIds = testRunFilterHelper.getFilteredTestRuns(request.project, filter)
            .map{ it.testRunId }

        val pipeline = mutableListOf(
            match(
                and (
                    TestResult::testRunId `in` testRunIds,
                    TestResult::status `in` TestStatus.finalStatuses,
                    or(
                        TestResult::testcaseId eq request.testcaseId,
                        TestResult::fullName regex request.testcaseId
                    )
                )
            ),
            sort(descending(TestResult::endDate)),
            """
                {
                    ${'$'}group: {
                        _id: "${'$'}fullName",
                        fullName: { ${'$'}first: "${'$'}fullName"},
                        testcaseId: { ${'$'}last: "${'$'}testcaseId"},
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
                            ${'$'}max: "${'$'}endDate"
                        },
                        lastSuccess: {
                            ${'$'}max: {
                               ${'$'}cond: {
                                   if: { ${'$'}eq: [ "${'$'}status", "SUCCESS" ] },
                                   then: "${'$'}endDate",
                                   else: null
                               }
                           } 
                        },
                    }
                }
            """.trimIndent().bson,
            """
                {
                    ${'$'}addFields: {
                        "successRate" : {
                            "${'$'}divide": ["${'$'}successRuns", "${'$'}totalRuns"]
                        }
                    }
 	            }
            """.trimIndent().bson,
            sort(
                descending(TestResult::endDate)
            )
        )

        if (takeLast > 0) {
            pipeline.add(2, limit(takeLast))
        }

        val testHistory = testResultsCollection.aggregate<SingleTestStats>(*pipeline.toTypedArray()).toList()

        return@runBlocking testHistory.firstOrNull()
    }
}