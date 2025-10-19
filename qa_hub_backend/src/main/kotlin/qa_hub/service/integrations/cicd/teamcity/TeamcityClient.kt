package qa_hub.service.integrations.cicd.teamcity

import qa_hub.service.integrations.cicd.teamcity.entity.*
import retrofit2.Response

class TeamcityClient(apiUrl: String, user: String, password: String) {
    private val teamcityService = TeamcityHttpInterface.getClient(apiUrl, user, password)

    fun getBranches(buildConfigurationId: String): TeamcityBranches {
        return teamcityService
                .getBranches(buildConfigurationId)
                .execute()
                .body()!!
    }

    fun startJob(body: TeamcityBuildRequest): Response<TeamcityBuild?> {
        return teamcityService
            .triggerBuild(body)
            .execute()
    }

    fun cancelJob(jobId: String): Int {
        return teamcityService
            .cancelBuild(jobId, CancelBuildRequest())
            .execute()
            .code()
    }

    fun filterBuilds(locator: String): TeamcityFilteredBuilds? {
        return teamcityService
            .filterBuilds(locator)
            .execute()
            .body()
    }

    fun findTriggeredBuilds(jobId: String): TeamcityFilteredBuilds? {
        return filterBuilds("defaultFilter:false,snapshotDependency:from:id:${jobId}")
    }
}

