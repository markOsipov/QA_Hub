package qa_hub.core.mongo.entity

enum class Collections(val collectionName: String) {
    BLOCKED_TESTS("blockedTests"),
    QA_HUB_CONFIG("qaHubConfig"),
    TESTCASES("testcases")
}