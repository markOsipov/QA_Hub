package qa_hub.service.integrations.cicd.teamcity.entity


data class TeamcityBuildRequest(
    val buildType: TeamcityBuildType,
    val branchName: String,
    val properties: TeamcityProperties
)

data class TeamcityBuild(
    val id: Long,
    val buildTypeId: String,
    val branchName: String,
    val webUrl: String
)

data class TeamcityFilteredBuilds(
    val count: Int,
    val href: String,
    val build: List<TeamcityBuild>
)

data class TeamcityBuildType(
    val id: String
)

data class TeamcityProperties(
    val property: List<TeamcityProperty>
)

data class TeamcityProperty(
    val name: String,
    val value: String
)

data class TeamcityBranches(
    val count: Int,
    var href: String,
    val branch: List<TeamcityBranch>
)

data class TeamcityBranch(
    val name: String,
    var default: Boolean? = null
)

data class CancelBuildRequest(
    val comment: String = "Cancelling the build via API"
)