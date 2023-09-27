package qa_hub.service.integrations.cicd.github

import qa_hub.entity.ProjectCicdInfo
import qa_hub.service.integrations.cicd.CicdInfo
import qa_hub.service.integrations.cicd.CicdIntegrationAbstract
import qa_hub.service.integrations.cicd.StartJobRequest
import qa_hub.service.integrations.cicd.StartJobResponse
import qa_hub.service.integrations.cicd.github.entity.StartWorkflowRequest

class GitHubService(cicdInfo: CicdInfo): CicdIntegrationAbstract(cicdInfo) {
    val client = GithubClient(cicdInfo.apiUrl, cicdInfo.apiToken!!)
    override fun startJob(info: ProjectCicdInfo, jobId: String, startJobRequest: StartJobRequest): StartJobResponse {
        val response = client.startJob(info.path, info.project, jobId, StartWorkflowRequest(startJobRequest.gitRef, startJobRequest.params))
        val code = response.code()
        val message = response.body()?.message

        return StartJobResponse(
            code, message
        )
    }

    override fun stopJob(info: ProjectCicdInfo, jobId: String) {
        client.cancelJob(info.path, info.project, jobId)
    }

    override fun getBranches(info: ProjectCicdInfo): List<String> {
        return client.getBranches(info.path, info.project).map { it.name }
    }
}