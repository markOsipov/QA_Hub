package qa_hub.service.integrations.taskTrackers.asana

import qa_hub.service.integrations.taskTrackers.asana.entity.AsanaTaskResponse

class AsanaClient(baseUrl: String, apiToken: String) {
    private val client = AsanaHttpInterface.getClient(baseUrl, apiToken)

    fun getTask(taskGid: String): AsanaTaskResponse {
        return client.getTask(taskGid)
                .execute()
                .body()!!
    }
}
