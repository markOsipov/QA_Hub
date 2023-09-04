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