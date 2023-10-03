package qa_hub.service.integrations.other.slack

enum class OtherIntegrationTypes(
    val type: String
) {
    SLACK("Slack")
}

open class AbstractOtherIntegrationInfo(
    open val type: String,
    open var sharedFields: List<String> = listOf(),
    open var projectFields: List<String> = listOf()
)

val slackInt = AbstractOtherIntegrationInfo(OtherIntegrationTypes.SLACK.type, listOf(), listOf("token", "channel"))

val otherIntegrations = listOf(slackInt)