package qa_hub.entity.testRun

data class TestResult(
    var testRunId: String,
    var testcaseId: String = "",
    var project: String?,
    var fullName: String,

    var duration: Double? = null,
    var status: String,
    var retries: Int = 0,

    var message: String? = null,
    var runner: String = "unknown",
    var device: String? = "simulator",
    var deviceRuntime: String = "unknown",
    var deviceId: String = "unknown",
    var attachments: MutableList<String> = mutableListOf()
)

enum class TestStatus(val status: String) {
    SUCCESS("SUCCESS"),
    FAILURE("FAILURE"),
    WAITING("WAITING"),
    PROCESSING("PROCESSING");

    companion object {
        fun isFinal(status: String): Boolean {
            return listOf(SUCCESS.status, FAILURE.status).contains(status)
        }
    }
}