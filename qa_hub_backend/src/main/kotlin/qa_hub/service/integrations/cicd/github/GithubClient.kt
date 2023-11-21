package qa_hub.service.integrations.cicd.github

import qa_hub.service.integrations.cicd.github.entity.GithubBranch
import qa_hub.service.integrations.cicd.github.entity.GithubStartJobResponse
import qa_hub.service.integrations.cicd.github.entity.StartWorkflowRequest
import retrofit2.Response

class GithubClient(apiUrl: String, apiToken: String) {
    private val githubService = GithubHttpInterface.getClient(apiUrl, apiToken)

    fun getBranches(org: String, project: String, perPage: Int = 100, page: Int = 1): List<GithubBranch> {
        return githubService
                .getBranches(org, project, perPage, page)
                .execute()
                .body()!!
    }

    fun startJob(org: String, project: String, workflowId: String, body: StartWorkflowRequest): Response<Any?> {
        return githubService
            .startWorkflow(org, project, workflowId, body)
            .execute()
    }

    fun cancelJob(org: String, project: String, jobId: String): Int {
        return githubService
            .cancelJob(org, project, jobId)
            .execute()
            .code()
    }
}
