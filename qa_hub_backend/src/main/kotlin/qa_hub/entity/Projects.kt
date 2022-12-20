package qa_hub.entity

// Separator is a symbol in full name of test, which separates test method name from test class or test suite
// For example:
// In android full test name is com.example.TestSuite#testMethod, separator is #
// In IOS full test name is TargetName.SuiteName.testName, separator is .

enum class Separators(val platform: String, val separator: String) {
    ANDROID("android", "#"),
    IOS("ios", "."),
    DEFAULT("unknown", ".");

    companion object {
        fun getSeparatorForPlatform(platform: String): String {
            return values().firstOrNull{ it.platform == platform }?.separator ?: DEFAULT.separator
        }
    }
}

data class Project(
    val _id: String? = null,
    val name: String,            //gitlab or other cicd project name
    val platform: String,        //used to define separator and build full test name correctly
    val separator: String = Separators.getSeparatorForPlatform(platform),
    val cicdPath: String,        // path to the project in gitlab or other cicd
    val cicdProjectId: String,   // id project in gitlab or other cicd
    val tmsProjectId: String,    // id project in testRail or other tms
)