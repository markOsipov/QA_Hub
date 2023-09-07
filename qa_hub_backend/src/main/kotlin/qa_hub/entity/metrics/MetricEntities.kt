package qa_hub.entity.metrics

data class MainProjectMetric(
    val project: String,
    val date: String,
    val auto: Int,
    val manual: Int,
    val blocked: Int
)
