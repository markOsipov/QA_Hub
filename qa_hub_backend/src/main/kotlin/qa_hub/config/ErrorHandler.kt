package qa_hub.config

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


@ControllerAdvice
class ErrorHandler {
    data class ErrorResponse(val status: String = "error", val message: String? = "Internal server error")

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(java.lang.Exception::class)
    fun handle(
        e: java.lang.Exception?,
        request: HttpServletRequest?, response: HttpServletResponse?
    ): ResponseEntity<ErrorResponse> {
        val builder = StringBuilder()
        builder.append(e?.stackTrace?.joinToString("\n   "))

        logger.error(e?.message)
        logger.error(builder.toString()) //For json logger

        e?.printStackTrace()
        return ResponseEntity.internalServerError().body(ErrorResponse(message = e?.message))
    }
}