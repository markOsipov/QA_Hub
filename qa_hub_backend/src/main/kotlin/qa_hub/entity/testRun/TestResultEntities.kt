package qa_hub.entity.testRun

import org.bson.conversions.Bson
import org.litote.kmongo.*

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
            filter.add(TestResult::tags all statuses)
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

    var duration: Double? = null,
    var status: String,
    var retries: Int = 0,
    var date: String? = null,

    var message: String? = null,
    var runner: String = "unknown",
    var device: String? = "simulator",
    var deviceRuntime: String = "unknown",
    var deviceId: String = "unknown",

    var reviewed: Boolean = false,
    var attachments: MutableList<TestResultAttachment> = mutableListOf()
)

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