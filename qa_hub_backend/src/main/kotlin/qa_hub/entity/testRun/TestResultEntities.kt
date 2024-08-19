package qa_hub.entity.testRun

import org.bson.conversions.Bson
import org.litote.kmongo.*
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

data class SingleTestResultRequest(
    val testRunId: String,
    val identifier: String
)

data class TestResultsRequest(
    val filter: TestResultFilter? = null,
    val pagination: Pagination? = Pagination()
)

data class Pagination(
    val skip: Int = 0,
    val limit: Int = 0
)
data class TestResultFilter(
    val statuses: MutableList<String> = mutableListOf(),
    val tags: MutableList<String> = mutableListOf(),
    val message: String?,
    val deviceId: String?,
    val runner: String?,
    val retries: Boolean?,
    val unreviewed: Boolean?,
    val search: String?
) {
    fun getMongoFilter(): MutableList<Bson> {
        val filter = mutableListOf<Bson>()

        if (deviceId != null) {
            filter.add(TestResult::deviceId eq deviceId)
        }

        if (runner != null) {
            filter.add(TestResult::runner eq runner)
        }

        if (message != null) {
            filter.add(TestResult::message regex message)
        }

        if (statuses.isNotEmpty()) {
            filter.add(TestResult::status `in` statuses)
        }

        if (retries == true) {
            filter.add(TestResult::retries gt 1)
        } else if ((retries == false)) {
            filter.add(TestResult::retries lte 1)
        }

        when (unreviewed) {
            true -> filter.add(TestResult::reviewed ne true)
            false -> filter.add(TestResult::reviewed eq true)
            else -> {}
        }

        if (tags.isNotEmpty()) {
            filter.add(TestResult::tags all tags)
        }

        if (search != null) {
            filter.add(
                or(
                    TestResult::fullName regex Regex(search, RegexOption.IGNORE_CASE),
                    TestResult::testcaseId regex Regex(search, RegexOption.IGNORE_CASE),
                    TestResult::tags regex Regex("^${search}${'$'}", RegexOption.IGNORE_CASE)
                )
            )
        }

        return filter
    }
}
data class TestResult(
    var testRunId: String,
    var testcaseId: String = "",
    var project: String?,

    var fullName: String,
    var title: String? = "",
    var tags: MutableList<String> = mutableListOf(),

    var tmsLaunchId: String? = null,

    var duration: Double? = null,       //duration of test execution, sended in test result. Usually calculated by test framework.
    var qaHubDuration: Double? = null,  //duration between entering processing status and entering final status on Qa Hub side.

    var status: String,
    var retries: Int = 0,

    var startDate: String? = null,
    var endDate: String? = null,

    var message: String? = null,
    var runner: String = "unknown",
    var device: String? = "unknown",
    var deviceRuntime: String = "unknown",
    var deviceId: String = "unknown",

    var reviewed: Boolean = false,
    var attachments: MutableList<TestResultAttachment> = mutableListOf()
) {
    fun calcQaHubDuration(): Double? {
        return try {
            ChronoUnit.MILLIS.between(
                ZonedDateTime.parse(this.startDate!!, DateTimeFormatter.ISO_INSTANT),
                ZonedDateTime.parse(this.endDate!!, DateTimeFormatter.ISO_INSTANT)
            ).toDouble() / 1000
        } catch (e: Exception) {
            null
        }
    }
}

data class TestResultAttachment(
    val type: String,
    val path: String,
    val fileName: String
)

object AttachmentTypes {
    val image = "image"
}

enum class TestStatus(val status: String) {
    SUCCESS("SUCCESS"),
    FAILURE("FAILURE"),
    WAITING("WAITING"),
    PROCESSING("PROCESSING");

    companion object {
        fun isFinal(status: String): Boolean {
            return listOf(SUCCESS.status, FAILURE.status).contains(status)
        }

        val finalStatuses = values().map { it.status }.filter { isFinal(it) }
    }
}