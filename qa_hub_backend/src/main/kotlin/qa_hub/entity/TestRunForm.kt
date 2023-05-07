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
    CHECKBOX("checkbox");
    //JSON("json");

    companion object {
        val stringValues: List<String>
            get() = values().map{ it.value }
    }
}

data class StartTestRunParam(
    val name: String,
    val type: String? = TestRunFormParams.TEXT.value,
    val value: String = "",
    val options: List<String> = listOf(),
    val description: String = "",
    val readOnly: Boolean = false
)