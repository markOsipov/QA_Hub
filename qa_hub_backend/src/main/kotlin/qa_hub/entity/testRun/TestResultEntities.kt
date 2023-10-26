package qa_hub.entity.testRun

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
    val message: String?,
    val deviceId: String?,
    val runner: String?,
    val retries: Boolean?,
    val unreviewed: Boolean?,
    val search: String?
)
data class TestResult(
    var testRunId: String,
    var testcaseId: String = "",
    var project: String?,
    var fullName: String,
    var title: String? = "",

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