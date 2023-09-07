package qa_hub.core.mongo.entity

enum class Collections(val collectionName: String) {
    PROJECTS("projects"),
    QA_HUB_CONFIG("qaHubConfig"),

    BLOCKED_TESTS("blockedTests"),
    TESTCASES("testcases"),
    TEST_LOGS("testLogs"),
    TEST_QA_REVIEWS("testQaReviews"),
    TEST_QUEUE("testQueue"),
    TEST_RESULTS_RETRIES("testResultsRetries"),
    TEST_RESULTS("testResults"),
    TEST_RUN_FORMS("testRunForms"),
    TEST_RUNS("testRuns"),
    TEST_STEPS("testSteps"),

    METRICS_MAIN("metricsMain"),

    CICD_INTEGRATIONS("cicdIntegrations"),
    TASK_TRACKER_INTEGRATIONS("taskTrackerIntegrations"),
    TMS_INTEGRATIONS("tmsIntegrations");
}