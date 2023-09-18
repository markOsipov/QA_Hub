package qa_hub.service.integrations.other.slack

import com.slack.api.Slack
import com.slack.api.methods.request.chat.ChatPostMessageRequest
import com.slack.api.methods.response.chat.ChatPostMessageResponse
import com.slack.api.model.block.LayoutBlock

// If the token is a bot token, it starts with `xoxb-` while if it's a user token, it starts with `xoxp-`
class SlackClient(token: String) {
    private val client = Slack.getInstance()
    private val methods = client.methods(token)

    fun sendTextMessage(channel: String, message: String): ChatPostMessageResponse {
        val request = ChatPostMessageRequest
            .builder()
            .channel(channel)
            .text(message)
            .build()

        return methods.chatPostMessage(request)
    }

    fun sendBlocksMessage(channel: String, blocks: List<LayoutBlock>): ChatPostMessageResponse {
        val request = ChatPostMessageRequest
            .builder()
            .channel(channel)
            .blocks(blocks)
            .build()

        return methods.chatPostMessage(request)
    }
}