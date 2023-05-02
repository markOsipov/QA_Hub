package qa_hub.core.utils

import com.google.gson.GsonBuilder
import com.google.gson.JsonElement
import com.google.gson.JsonParser


fun String.toPrettyJson(): String {
    if (this.isEmpty()) return this
    try {
        val parser = JsonParser()
        val json: JsonElement = if (this.trim().first() == '[') {
            parser.parse(this).asJsonArray
        } else { parser.parse(this).asJsonObject }

        val gson = GsonBuilder().setPrettyPrinting().create()
        return gson.toJson(json)
    } catch (e: Exception) {
        throw Exception("Failed to prettify json. Source string is not valid json: $this")
    }
}