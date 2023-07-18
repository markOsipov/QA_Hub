package qa_hub.core.mongo.entity

enum class Collections(val collectionName: String) {
    BLOCKED_TESTS("blockedTests"),
    CICD_INTEGRATIONS("cicdIntegrations"),
    PROJECTS("projects"),
    QA_HUB_CONFIG("qaHubConfig"),
    TESTCASES("testcases"),
    TEST_RESULTS_RETRIES("testResultsRetries"),
    TEST_RESULTS("testResults"),
    TEST_RUN_FORMS("testRunForms"),
    TEST_RUNS("testRuns"),
    TEST_QUEUE("testQueue"),
    TMS_INTEGRATIONS("tmsIntegrations");
}