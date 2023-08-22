package qa_hub.service.integrations.cicd.github.entity

import kotlin.reflect.jvm.internal.impl.load.kotlin.JvmType


data class GithubBranch(
    val name: String,
    val protected: Boolean,
    val commit: GithubCommit
)

data class GithubCommit(
    val sha: String,
    val url: String
)

data class StartWorkflowRequest(
    val ref: String,
    val inputs: Map<String, String>
)