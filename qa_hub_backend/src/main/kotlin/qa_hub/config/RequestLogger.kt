package qa_hub.config

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.filter.GenericFilterBean
import org.springframework.web.util.ContentCachingRequestWrapper
import org.springframework.web.util.ContentCachingResponseWrapper
import qa_hub.core.utils.toPrettyJson
import java.util.function.Function
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
class LoggingFilterBean : GenericFilterBean() {
    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        val requestWrapper = requestWrapper(request)
        val responseWrapper = responseWrapper(response)
        chain.doFilter(requestWrapper, responseWrapper)
        logRequest(requestWrapper)
        logResponse(responseWrapper)
    }

    private fun logRequest(request: ContentCachingRequestWrapper) {
        if (!request.servletPath.contains("/api/utils/logs")) {
            val builder = StringBuilder()
            val parameters = request.parameterMap.map { "${it.key} = ${it.value.first()}" }
            builder.append("")
            builder.append("Parameters: $parameters")
            //builder.append(headersToString(request.headerNames.toList(), request::getHeader))
            builder.append("\nBody: ${String(request.contentAsByteArray)}")

            log.info("Request ${request.method} ${request.servletPath}\n$builder")
        }
    }

    private fun logResponse(response: ContentCachingResponseWrapper) {
        if (response.getHeader("Skip-Logging") != "true") {
            val status = response.status
            val body = String(response.contentAsByteArray).toPrettyJson()

            val builder = StringBuilder()
            //builder.append(headersToString(response.headerNames, response::getHeader))
            builder.append(body)

            val result = "Response: ${response.status}\n$builder"
            if (status >= 400) {
                log.error(result)
            } else {
                log.info(result)
            }
        }
        response.copyBodyToResponse()
    }

    private fun headersToString(
        headerNames: Collection<String>,
        headerValueResolver: Function<String, String>
    ): String {
        val builder = StringBuilder()
        for (headerName in headerNames) {
            val header: String = headerValueResolver.apply(headerName)
            builder.append("$headerName = $header").append("\n")
        }
        return builder.toString()
    }

    private fun requestWrapper(request: ServletRequest): ContentCachingRequestWrapper {
        return request as? ContentCachingRequestWrapper ?: ContentCachingRequestWrapper((request as HttpServletRequest))
    }

    private fun responseWrapper(response: ServletResponse): ContentCachingResponseWrapper {
        return response as? ContentCachingResponseWrapper
            ?: ContentCachingResponseWrapper((response as HttpServletResponse))
    }

    companion object {
        private val log: Logger = LoggerFactory.getLogger(LoggingFilterBean::class.java)
    }
}