package qa_hub.service.integrations.tms.allure.entity

data class AllureCreateTestrunRequest(
    var projectId: Int,
    var name: String,
    var external: Boolean = true,
    var autoclose: Boolean = false,
    var tags: List<HashMap<String, Any>> = listOf(),
    var links: List<HashMap<String, Any>> = listOf(),
    var issues: List<HashMap<String, Any>> = listOf(),
)

data class AllureCreateTestrunResponse(
    val id: Int
)

data class AllureTestcasesResponse(
    val totalElements: Int,
    val totalPages: Int,
    val size: Int,
    val content: List<AllureTestcase>,
    val number: Int,
    val first: Boolean,
    val last: Boolean,
    val empty: Boolean
)
data class AllureTestcase(
    val id: Int,
    val name: String,
    val automated: Boolean,
    val status: AllureTestcaseStatus
)

data class AllureTestcaseStatus(
    val id: Int,
    val name: String,
    val color: String,
    val createdDate: Long,
    val lastModifiedDate: Long,
    val createdBy: String,
    val lastModifiedBy: String
)