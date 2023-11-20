package qa_hub.service.testResults

import com.mongodb.client.result.UpdateResult
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.*
import org.litote.kmongo.coroutine.aggregate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.core.mongo.utils.setCurrentPropertyValues
import qa_hub.core.utils.DateTimeUtils
import qa_hub.entity.testRun.*
import qa_hub.service.TestRunService

@Service
class TestResultsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient


    private val testResultsCollection by lazy {
        mongoClient.db.getCollection<TestResult>(Collections.TEST_RESULTS.collectionName)
    }

    private val testResultsRetriesCollection by lazy {
        mongoClient.db.getCollection<TestResultRetry>(Collections.TEST_RESULTS_RETRIES.collectionName)
    }

    private val testRunCollection by lazy {
        mongoClient.db.getCollection<TestRun>(Collections.TEST_RUNS.collectionName)
    }

    fun findSingleResult(testRunId: String, identifier: String): TestResult? = runBlocking {
        testResultsCollection.findOne(
            and(
                TestResult::testRunId eq testRunId,
                or(
                    TestResult::fullName eq identifier,
                    TestResult::testcaseId eq identifier
                )
            )
        )
    }

    fun findTestResults(testRunId: String, request: TestResultsRequest?): List<TestResult> = runBlocking {
        val filter = mutableListOf(TestResult::testRunId eq testRunId)

        request?.filter?.let {
            if (it.deviceId != null) {
                filter.add(TestResult::deviceId eq it.deviceId)
            }

            if (it.runner != null) {
                filter.add(TestResult::runner eq it.runner)
            }

            if (it.message != null) {
                filter.add(TestResult::message regex it.message)
            }

            if (it.statuses.isNotEmpty()) {
                filter.add(TestResult::status `in` it.statuses)
            }

            if (it.retries == true) {
                filter.add(TestResult::retries gt 1)
            } else if ((it.retries == false)) {
                filter.add(TestResult::retries lte 1)
            }

            when (it.unreviewed) {
                true -> filter.add(TestResult::reviewed ne true)
                false -> filter.add(TestResult::reviewed eq true)
                else -> {}
            }

            if (it.search != null) {
                filter.add(
                    or(
                        TestResult::fullName regex Regex(it.search, RegexOption.IGNORE_CASE),
                        TestResult::testcaseId regex Regex(it.search, RegexOption.IGNORE_CASE),
                        TestResult::tags regex Regex("^${it.search}${'$'}", RegexOption.IGNORE_CASE)
                    )
                )
            }
        }

        val query = mutableListOf(
            match(and(*filter.toTypedArray())),
            sort(ascending(TestResult::fullName)),
            skip(request?.pagination?.skip ?: 0 ))

        if ((request?.pagination?.limit ?: 0)> 0) {
            query.add(limit(request!!.pagination!!.limit) )
        }

        testResultsCollection.aggregate<TestResult>(query).toList()
    }


    data class CountResponse(val count: Long)
    fun countTestResults(testRunId: String, request: TestResultFilter?): CountResponse = runBlocking {
        val filter = mutableListOf(TestResult::testRunId eq testRunId)

        request?.let {
            if (it.deviceId != null) {
                filter.add(TestResult::deviceId eq it.deviceId)
            }

            if (it.runner != null) {
                filter.add(TestResult::runner eq it.runner)
            }

            if (it.message != null) {
                val specialCharacters = ".+*[]()"
                var screenedMessage: String = it.message

                specialCharacters.forEach { char ->
                    screenedMessage = screenedMessage.replace("$char", "\\$char")
                }


                filter.add(TestResult::message regex screenedMessage)
            }

            if (it.statuses.isNotEmpty()) {
                filter.add(TestResult::status `in` it.statuses)
            }

            if (it.retries == true) {
                filter.add(TestResult::retries gt 1)
            } else if ((it.retries == false)) {
                filter.add(TestResult::retries lte 1)
            }

            when (it.unreviewed) {
                true -> filter.add(TestResult::reviewed ne true)
                false -> filter.add(TestResult::reviewed eq true)
                else -> {}
            }
        }

        return@runBlocking CountResponse(testResultsCollection.countDocuments(filter = and(*filter.toTypedArray())))
    }

    fun findTestRetries(testRunId: String, fullName: String): List<TestResultRetry> = runBlocking {
        testResultsRetriesCollection.aggregate<TestResultRetry>(
            match(
                and(
                    TestResultRetry::testRunId eq testRunId),
                    TestResultRetry::fullName eq fullName
                ),
            sort(ascending(TestResultRetry::retry))
        ).toList()
    }

    suspend fun updateActualTestsCount(testRunId: String) {
        val testsCount = getActualTestsCount(testRunId)

        testRunCollection.updateOne(
            TestRun::testRunId eq testRunId,
            set(
                TestRun::tests setTo testsCount
            )
        )
    }

    fun getActualTestsCount(testRunId: String) = runBlocking {
        val filter = TestResult::testRunId eq testRunId

        val totalCount = testResultsCollection.countDocuments(filter).toInt()
        val successCount = testResultsCollection.countDocuments(
            and(filter, TestResult::status eq TestStatus.SUCCESS.status)
        ).toInt()
        val failedCount = testResultsCollection.countDocuments(
            and(filter, TestResult::status eq TestStatus.FAILURE.status)
        ).toInt()

        return@runBlocking TestRunTests(
            testsCount = totalCount,
            failsCount = failedCount,
            successCount = successCount,
        )
    }

    fun updateTestResult(testResult: TestResult): UpdateResult = runBlocking {
        val skipProperties = mutableListOf("_id", "testRunId", "fullName")
        if (testResult.status != TestStatus.PROCESSING.status) {
            skipProperties.add("retries")
        }

        testResult.date = DateTimeUtils.currentDateTimeUtc()
        launch {
            updateRetriesInfo(testResult)
        }

        val result = testResultsCollection.updateOne(
            and(
                TestResult::testRunId eq testResult.testRunId,
                TestResult::fullName eq testResult.fullName
            ),
            set(
                *(testResult.setCurrentPropertyValues(skipProperties))
            )
        )

        launch {
            updateActualTestsCount(testResult.testRunId)
        }

        result
    }

    private suspend fun updateRetriesInfo(testResult: TestResult) {
        val filter = and(
            TestResultRetry::testRunId eq testResult.testRunId,
            TestResultRetry::fullName eq testResult.fullName
        )

        val historyItem = StatusHistoryItem(testResult)
        val existingRetries = testResultsRetriesCollection.find(filter).toList()

        if (
            existingRetries.isEmpty() ||
            historyItem.status == TestStatus.PROCESSING.status ||
            TestStatus.isFinal(existingRetries.last().statusHistory.last().status)
        ) {
            testResultsRetriesCollection.insertOne(
                TestResultRetry(
                    testRunId = testResult.testRunId,
                    fullName = testResult.fullName,
                    testcaseId = testResult.testcaseId,
                    retry = existingRetries.size + 1,
                    statusHistory = mutableListOf(historyItem)
                )
            )
        } else {
            testResultsRetriesCollection.updateOne(
                and(
                    TestResultRetry::testRunId eq testResult.testRunId,
                    TestResultRetry::fullName eq testResult.fullName,
                    TestResultRetry::retry eq existingRetries.size,
                ),
                push(
                    TestResultRetry::statusHistory, historyItem
                )
            )
        }
    }

    fun forceStopForDevice(testRunId: String, simulatorId: String, runner: String) = runBlocking {
        val hangingTests = testResultsCollection.find(
            and(TestResult::testRunId eq testRunId,
                TestResult::deviceId eq simulatorId,
                TestResult::status eq TestStatus.PROCESSING.status
            )
        ).toList()

        hangingTests.forEach {
            forceStop(testResult = it)
        }
    }

    private fun forceStop(
        testResult: TestResult,
        message: String = "Unexpected test failure."
    ) = runBlocking {
        testResult.message = message
        testResult.status = TestStatus.FAILURE.status

        updateTestResult(testResult)
    }


    data class TimelineData(
        val startDate: String,
        val endDate: String,
        val runners: List<TimelineRunnerInfo>
    )

    data class TimelineRunnerInfo(
        val runner: String,
        val startDate: String,
        val endDate: String,
        val devices: List<TimelineDeviceInfo>
    )
    data class TimelineDeviceInfo(
        val runner: String,
        val deviceId: String,
        val startDate: String,
        val endDate: String,
        val results: List<TimelineElement>
    )

    data class TimelineElement(
        val fullName: String,
        var testcaseId: String? = null,
        val status: String,
        val startDate: String,
        val endDate: String,
        val duration: Double,
        val retry: Int
    )
    fun getTestrunTimelineData(testRunId: String): TimelineData? = runBlocking {
        val pipeline: MutableList<String> = mutableListOf(
            match(
              TestResultRetry::testRunId eq testRunId
            ).json,

            """
                {
                    ${'$'}addFields: {
                        deviceId: { ${'$'}last: "${'$'}statusHistory.deviceId" },
                        runner: { ${'$'}last: "${'$'}statusHistory.runner" }
                        status: { ${'$'}last: "${'$'}statusHistory.status" }
                        startDate: { ${'$'}first: "${'$'}statusHistory.date" }
                        endDate: { ${'$'}last: "${'$'}statusHistory.date" }
                        duration: { ${'$'}last: "${'$'}statusHistory.duration" }
                    }
 	            }
            """.trimIndent(),

            """
                {
                    ${'$'}group: {
                        _id: "${'$'}deviceId",
                        deviceId:  { ${'$'}first: "${'$'}deviceId"}, 
                        runner: { ${'$'}first: "${'$'}runner"},
                        startDate: { ${'$'}min: "${'$'}startDate"},
                        endDate: { ${'$'}max: "${'$'}endDate"},
                        results: { ${'$'}push: "${"$$"}ROOT" }                        
                    }
                }
            """.trimIndent(),

            """
                {
                    ${'$'}sort: {                     
                        "deviceId": 1                       
                    }
                }
            """.trimIndent(),

            """
                {
                    ${'$'}group: {
                        _id: "${'$'}runner",                      
                        runner: { ${'$'}first: "${'$'}runner"},   
                        startDate: { ${'$'}min: "${'$'}startDate"},
                        endDate: { ${'$'}max: "${'$'}endDate"},
                        devices: { ${'$'}push: "${"$$"}ROOT" }                      
                    }
                }
            """.trimIndent(),

            """
                {
                    ${'$'}sort: {                     
                        "runner": 1                       
                    }
                }
            """.trimIndent(),

            """
                {
                    ${'$'}group: {
                        _id: "1",              
                        startDate: { ${'$'}min: "${'$'}startDate"},
                        endDate: { ${'$'}max: "${'$'}endDate"},
                        runners: { ${'$'}push: "${"$$"}ROOT" }                
                    }
                }
            """.trimIndent(),


        )


        return@runBlocking testResultsRetriesCollection.aggregate<TimelineData>(*pipeline.toTypedArray()).first()
    }
}