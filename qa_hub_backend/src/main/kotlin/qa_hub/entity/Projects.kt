package qa_hub.entity

// Separator is a symbol in full name of test, which separates test method name from test class or test suite
// For example:
// In android full test name is com.example.TestSuite#testMethod, separator is #
// In IOS full test name is TargetName.SuiteName.testName, separator is .

data class Platform(val name: String, val separator: String)

enum class Platforms(val platform: Platform) {
    ANDROID(Platform("android", "#")),
    IOS(Platform("ios", ".")),
    DEFAULT(Platform("unknown", "."));

    companion object {
        fun getSeparator(platform: String): String {
            return values().firstOrNull{
                it.platform.name == platform
            }?.platform?.separator ?: DEFAULT.platform.separator
        }
    }
}

data class Project(
    var _id: String? = null,
    val name: String,                        //gitlab or other cicd project name
    val platform: String,                    //used to define separator and build full test name correctly
    val separator: String = Platforms.getSeparator(platform),
    val cicdPath: String =      "/",         // path to the project in gitlab or other cicd
    val cicdProjectId: String = "/",         // id project in gitlab or other cicd
    val tmsProjectId: String =  "/",         // id project in testRail or other tms
)