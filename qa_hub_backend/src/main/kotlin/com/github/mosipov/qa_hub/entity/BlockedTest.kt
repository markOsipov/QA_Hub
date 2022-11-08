package com.github.mosipov.qa_hub.entity

import org.bson.types.ObjectId

data class BlockedTest(
    var _id: String? = null,
    var shortName: String,
    var fullName: String,
    var testcaseId: String?,
    var jiraIssue: String?,
    var comment: String? = null,
    var blockDate: String? = null,
    var project: String,
    var allowTrialRuns: Boolean? = false
)