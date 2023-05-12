package qa_hub.core.utils

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

object DateTimeUtils {
    val defaultDatePattern = DateTimeFormatter.ofPattern("dd-MM-yyyy")

    fun formatDate(
        date: LocalDateTime = LocalDateTime.now(),
        formatter: DateTimeFormatter = defaultDatePattern
    ): String {
       return date.format(formatter)
    }

    fun getCurrentTimestamp(): Long {
        val currentInstant = java.time.Instant.now()
        return  currentInstant.toEpochMilli()
    }
}