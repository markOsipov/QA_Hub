package qa_hub.service.integrations.cicd.github

import qa_hub.service.integrations.cicd.github.entity.GithubBranch
import qa_hub.service.integrations.cicd.github.entity.StartWorkflowRequest

class GithubClient(baseUrl: String, apiToken: String) {
    private val githubService = GithubHttpInterface.getClient(baseUrl, apiToken)

    fun getBranches(org: String, project: String): List<GithubBranch> {
        return githubService
                .getBranches(org, project)
                .execute()
                .body()!!
    }

    fun startJob(org: String, project: String, workflowId: String, body: StartWorkflowRequest): Int {
        return githubService
            .startWorkflow(org, project, workflowId, body)
            .execute()
            .code()
    }

    fun cancelJob(org: String, project: String, jobId: String): Int {
        return githubService
            .cancelJob(org, project, jobId)
            .execute()
            .code()
    }
}
