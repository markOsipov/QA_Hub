package qa_hub.utils

import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

object DateTimeHelper {
    fun currentDateTimeUtc(): String {
        return ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT )
    }

    fun currentEpoch(): Long {
        return ZonedDateTime.now(ZoneOffset.UTC).toEpochSecond()
    }
}