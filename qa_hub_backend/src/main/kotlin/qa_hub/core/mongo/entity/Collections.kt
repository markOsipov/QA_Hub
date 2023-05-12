package qa_hub.core.mongo.entity

enum class Collections(val collectionName: String) {
    BLOCKED_TESTS("blockedTests"),
    PROJECTS("projects"),
    QA_HUB_CONFIG("qaHubConfig"),
    TESTCASES("testcases"),
    TEST_RESULTS("testResults"),
    TEST_RUNS("testRuns"),
    TEST_RUN_HISTORY("testRunHistory"),
    TEST_RUN_RUNNERS("testRunners"),
    TEST_RUN_PARAMS("testRunParams"),
    TEST_RUN_TEST_QUEUE("testRunTestQueue"),
    TEST_RUN_FORMS("testRunForms"),
    TMS_INTEGRATIONS("tmsIntegrations");
}