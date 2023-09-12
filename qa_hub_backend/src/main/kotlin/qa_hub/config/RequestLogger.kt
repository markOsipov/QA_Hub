package qa_hub.config

import com.google.gson.GsonBuilder
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.filter.GenericFilterBean
import org.springframework.web.util.ContentCachingRequestWrapper
import org.springframework.web.util.ContentCachingResponseWrapper
import qa_hub.core.utils.toPrettyJson
import java.util.function.Function
import javax.servlet.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
class LoggingFilterBean : GenericFilterBean() {
    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        try {
            val requestWrapper = requestWrapper(request)
            val responseWrapper = responseWrapper(response)

            chain.doFilter(requestWrapper, responseWrapper)

            logRequest(requestWrapper)
            logResponse(responseWrapper)

            //Required for stream responses and serving bytearrays, images, binary data etc
            if (requestWrapper.isAsyncStarted) {
                requestWrapper.asyncContext.addListener(CustomListener(responseWrapper))
            } else {
                responseWrapper.copyBodyToResponse()
            }
        } catch (e: Exception) {
            error(e)
        }
    }

    private fun logRequest(request: ContentCachingRequestWrapper) {
        try {
            if (!request.servletPath.contains("/api/utils/logs")) {
                val builder = StringBuilder()
                val parameters = request.parameterMap.map { "${it.key} = ${it.value.first()}" }
                builder.append("")
                builder.append("Parameters: $parameters")
                //builder.append(headersToString(request.headerNames.toList(), request::getHeader))
                try {
                    builder.append("\nBody: ${String(request.contentAsByteArray).toPrettyJson()}")
                } catch (e: Exception) {
                }

                log.info("Request ${request.method} ${request.servletPath}\n$builder")
            }
        } catch (e: Exception) {
            log.info("Can't log request")
        }
    }

    private fun logResponse(response: ContentCachingResponseWrapper) {
        try {
            if (response.getHeader("Skip-Logging") != "true") {
                val status = response.status

                val builder = StringBuilder()
                builder.append( "Response: ${response.status}")
                val bytes = String(response.contentAsByteArray)
                if (response.contentType.lowercase().contains("json")) {
                    val body = String(response.contentAsByteArray).toPrettyJson()

                    //builder.append(headersToString(response.headerNames, response::getHeader))
                    builder.append("\n$body")
                } else {
                    builder.append("\nPayload size: ${bytes.length}")
                }
                val result = builder.toString()

                if (status >= 400) {
                    log.error(result)
                } else {
                    log.info(result)
                }
            }
            response.copyBodyToResponse()
        } catch (e: Exception) {
            log.warn("Can't log response")
        }
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
        val responseWrapper = response as? ContentCachingResponseWrapper
            ?: ContentCachingResponseWrapper((response as HttpServletResponse))

        return responseWrapper
    }

    companion object {
        private val log: Logger = LoggerFactory.getLogger(LoggingFilterBean::class.java)
    }
}

class CustomListener(val responseWrapper: ContentCachingResponseWrapper): AsyncListener {
    override fun onComplete(event: AsyncEvent?) { responseWrapper.copyBodyToResponse() }
    override fun onTimeout(event: AsyncEvent?) {}
    override fun onError(event: AsyncEvent?) {}
    override fun onStartAsync(event: AsyncEvent?) {}
}