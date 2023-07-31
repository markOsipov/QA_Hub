package qa_hub.core.utils

import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

object DateTimeUtils {
    val defaultDatePattern = DateTimeFormatter.ofPattern("dd-MM-yyyy")

    fun formatDate(
        date: ZonedDateTime = ZonedDateTime.now(ZoneOffset.UTC),
        formatter: DateTimeFormatter = defaultDatePattern
    ): String {
       return date.format(formatter)
    }
    fun currentDateTimeUtc(): String {
        return ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT )
    }

    fun currentEpoch(): Long {
        return ZonedDateTime.now(ZoneOffset.UTC).toEpochSecond()
    }
}