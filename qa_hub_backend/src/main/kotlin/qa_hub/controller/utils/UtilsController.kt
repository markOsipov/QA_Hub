package qa_hub.controller.utils

import com.google.gson.Gson
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.io.File

@RestController
@RequestMapping("/api/utils")
class UtilsController {
    data class LogEntity(
        val timestamp: String,
        val level: String,
        val thread: String,
        val logger: String,
        val message: String
    )
    @GetMapping("/logs")
    fun getLogs(@RequestParam(required = false, defaultValue = "200") linesCount: Int): ResponseEntity<List<LogEntity>> {
        val responseHeaders = HttpHeaders()
        responseHeaders.set("Skip-Logging", "true")

        val logFilePath = "/var/log/qa_hub/application_json.log"

        val logFile = File(logFilePath)
        if (logFile.exists()) {
            val logs = logFile.readText().lines().takeLast(linesCount + 1).map {
                Gson().fromJson(it, LogEntity::class.java)
            }.dropLast(1)

            return ResponseEntity.ok().headers(responseHeaders).body(logs)
        } else {
            throw Exception("Logs file is not found on path: $logFilePath")
        }
    }
}