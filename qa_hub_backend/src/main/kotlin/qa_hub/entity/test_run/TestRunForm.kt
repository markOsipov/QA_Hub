package qa_hub.entity.test_run

data class StartTestRunForm(
    val project: String,
    val params: MutableList<TestRunParamConfig>
)

enum class TestRunFormParams(val value: String) {
    TEXT("text"),
    TEXT_AREA("textArea"),
    SELECT("select"),
    MULTI_SELECT("multiSelect"),
    BOOLEAN("boolean");
    //JSON("json");

    companion object {
        val stringValues: List<String>
            get() = values().map{ it.value }
    }
}

data class TestRunParamConfig(
    val name: String,
    val type: String? = TestRunFormParams.TEXT.value,
    val defaultValue: String = "",
    val options: List<String> = listOf(),
    val description: String = "",
    val readOnly: Boolean = false,
    val muted: Boolean = false
)