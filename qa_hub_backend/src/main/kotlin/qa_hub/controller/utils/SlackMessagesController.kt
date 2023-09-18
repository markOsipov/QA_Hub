package qa_hub.controller.utils

import com.slack.api.methods.response.chat.ChatPostMessageResponse
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import qa_hub.service.integrations.other.slack.SlackClient

@RestController
@RequestMapping("/api/slack")
class SlackMessagesController {

    data class SendTextMessageRequest(
        val channel: String,
        val message: String,
        val token: String
    )

    @PostMapping("/text")
    fun sendTextMessage(@RequestBody body: SendTextMessageRequest): ChatPostMessageResponse {
        return SlackClient(body.token).sendTextMessage(body.channel, body.message)
    }
}