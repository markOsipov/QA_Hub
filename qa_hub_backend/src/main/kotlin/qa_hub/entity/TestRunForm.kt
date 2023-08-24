package qa_hub.entity

data class StartTestRunForm(
    val project: String,
    val params: MutableList<StartTestRunParam>
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

data class StartTestRunParam(
    val name: String,
    val type: String? = TestRunFormParams.TEXT.value,
    val role: String = "other",
    val defaultValue: String = "",
    val options: List<String> = listOf(),
    val description: String = "",
    val readOnly: Boolean = false,
    val muted: Boolean = false
)