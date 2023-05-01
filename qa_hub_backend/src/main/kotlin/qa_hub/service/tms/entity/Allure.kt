package qa_hub.service.tms.entity

class Allure(tmsInfo: TmsInfo): TmsIntegrationAbstract(tmsInfo) {
    override fun getProjects(): List<TmsProjectAbstract> {
        TODO("Not yet implemented")
    }

    override fun getProject(projectId: String): TmsProjectAbstract {
        TODO("Not yet implemented")
    }

    override fun getTestcases(projectId: String): List<TestcaseAbstract> {
        TODO("Not yet implemented")
    }

    override fun getTestcase(projectId: String, testcaseId: String): TestcaseAbstract {
        TODO("Not yet implemented")
    }

    override fun updateTestcase(projectId: String, testcaseId: String): TestcaseAbstract {
        TODO("Not yet implemented")
    }
}