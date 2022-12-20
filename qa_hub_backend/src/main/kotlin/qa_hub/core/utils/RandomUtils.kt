package qa_hub.core.utils

import kotlin.random.Random

object RandomUtils {
    fun getRandomString(
        length: Int,
        allowedChars: List<Char> = ('A'..'Z') + ('a'..'z')
    ): String {
        return (1..length)
            .map { allowedChars.random() }
            .joinToString("")
    }
}