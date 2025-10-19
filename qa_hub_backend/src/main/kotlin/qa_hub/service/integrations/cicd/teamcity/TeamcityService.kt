package qa_hub.service.integrations.cicd.teamcity

import qa_hub.entity.ProjectCicdInfo
import qa_hub.service.integrations.cicd.CicdInfo
import qa_hub.service.integrations.cicd.CicdIntegrationAbstract
import qa_hub.service.integrations.cicd.StartJobRequest
import qa_hub.service.integrations.cicd.StartJobResponse
import qa_hub.service.integrations.cicd.teamcity.entity.*

class TeamcityService(cicdInfo: CicdInfo): CicdIntegrationAbstract(cicdInfo) {
    val client = TeamcityClient(cicdInfo.apiUrl, cicdInfo.login!!, cicdInfo.password!!)

    override fun startJob(info: ProjectCicdInfo, jobId: String, startJobRequest: StartJobRequest): StartJobResponse {
        val response = client.startJob(
            TeamcityBuildRequest(
                buildType = TeamcityBuildType(
                    id = jobId
                ),
                branchName = startJobRequest.gitRef,
                properties = TeamcityProperties(
                    property =  startJobRequest.params.map { TeamcityProperty(it.key, it.value) }
                )
            )
        )
        val code = response.code()
        var message: String? = null

        response.errorBody()?.let {
            message = it.string()
        }

        return StartJobResponse(
            code, message
        )
    }

    override fun stopJob(info: ProjectCicdInfo, jobId: String) {
        try {
            client.cancelJob(jobId)
        } finally {
            val triggeredBuilds = client.findTriggeredBuilds(jobId)?.build

            triggeredBuilds?.forEach {triggeredBuild ->
                try {
                    client.cancelJob(triggeredBuild.id.toString())
                } catch (_: Exception) {}
            }
        }
    }

    override fun getBranches(info: ProjectCicdInfo): List<String> {
        return client.getBranches(info.jobId).branch.map { it.name }
    }
}