package qa_hub.service.integrations.tms.qase.entity

data class QaseCreateTestrunRequest(
    var title: String,
    var description: String = "",
    var is_autotest: Boolean = true
)

data class QaseCreateTestrunResponse(
    val status: Boolean,
    val result: QaseCreateTestrunResponseResult
)

data class QaseCompleteTestrunResponse(
    val status: Boolean
)

data class QaseCreateTestrunResponseResult(
    val id: Int
)
data class QaseTestcasesResponse(
    val status: Boolean,
    val result: QaseTestcasesResponseResult
)

data class QaseTestcasesResponseResult(
    val total: Int,
    val count: Int,
    val entities: List<QaseTestcase>
)
data class QaseTestcase(
    val id: Int,
    val title: String,
    val isManual: Boolean,
    val status: Int
)

data class QaseCreateTestResultRequest(
    val case_id: Int,
    val status: String,
    val time: Int = 0,
    val stacktrace: String? = null
)

data class QasePostTestResultResponse(
    val status: Boolean,
    val result: QasePostTestResultResponseResult
)

data class QasePostTestResultResponseResult(
    val case_id: Int,
    val hash: String
)
enum class QaseStatus(val code: Int, val statusName: String) {
    ACTUAL(0, "Actual"),
    DRAFT(1, "Draft"),
    DEPRECATED(2, "Deprecated"),
    REVIEW(3, "Review");

    companion object {
        fun getNameByCode(code: Int): String {
            return QaseStatus.values().firstOrNull{
                it.code == code
            }?.statusName ?: "Unknown"
        }
    }
}

enum class QaseTestResult(val result: String) {
    PASSED("passed"),
    FAILED("failed"),
    SKIPPED("skipped"),
    BLOCKED("blocked"),
    INVALID("invalid")
}