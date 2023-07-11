package qa_hub.core.mongo.entity

enum class Collections(val collectionName: String) {
    BLOCKED_TESTS("blockedTests"),
    PROJECTS("projects"),
    QA_HUB_CONFIG("qaHubConfig"),
    TESTCASES("testcases"),
    TEST_STATUS_HISTORY("testStatusHistory"),
    TEST_RESULTS("testResults"),
    TEST_RUN_FORMS("testRunForms"),
    TEST_RUNS("testRuns"),
    TEST_QUEUE("testQueue"),
    TMS_INTEGRATIONS("tmsIntegrations");
}