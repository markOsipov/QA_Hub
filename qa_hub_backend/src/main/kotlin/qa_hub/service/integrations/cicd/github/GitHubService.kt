package qa_hub.service.integrations.cicd.github

import com.google.gson.Gson
import qa_hub.entity.ProjectCicdInfo
import qa_hub.service.integrations.cicd.CicdInfo
import qa_hub.service.integrations.cicd.CicdIntegrationAbstract
import qa_hub.service.integrations.cicd.StartJobRequest
import qa_hub.service.integrations.cicd.StartJobResponse
import qa_hub.service.integrations.cicd.github.entity.GithubStartJobResponse
import qa_hub.service.integrations.cicd.github.entity.StartWorkflowRequest

class GitHubService(cicdInfo: CicdInfo): CicdIntegrationAbstract(cicdInfo) {
    val client = GithubClient(cicdInfo.apiUrl, cicdInfo.apiToken!!)
    override fun startJob(info: ProjectCicdInfo, jobId: String, startJobRequest: StartJobRequest): StartJobResponse {
        val response = client.startJob(info.path, info.project, jobId, StartWorkflowRequest(startJobRequest.gitRef, startJobRequest.params))
        val code = response.code()
        var message: String? = null

        response.errorBody()?.let {
            message = Gson().fromJson(it.string(), GithubStartJobResponse::class.java).message
        }

        return StartJobResponse(
            code, message
        )
    }

    override fun stopJob(info: ProjectCicdInfo, jobId: String) {
        client.cancelJob(info.path, info.project, jobId)
    }

    override fun getBranches(info: ProjectCicdInfo): List<String> {
        val branches = mutableListOf<String>()
        var finished = false
        var page = 1
        val maxPages = 5
        while (!finished) {
            val response = client.getBranches(info.path, info.project, 100, page).map { it.name }
            branches.addAll(response)
            page += 1

            finished = response.isEmpty() || page == maxPages
        }
        return branches
    }
}