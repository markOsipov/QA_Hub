package qa_hub.core.utils

import kotlinx.coroutines.*
import org.apache.juli.logging.LogFactory

fun runParallel(vararg actions: () -> Unit, timeout: Long = 30000, failOnError: Boolean = true) {
    runParallel(actions.toList(), timeout, failOnError)
}

fun runParallel(actions: Collection<() -> Unit>, timeout: Long = 30000, failOnError: Boolean = true) {
    val logger =  LogFactory.getLog("CoroutineLogger")
    val deferredJobs = mutableListOf<Job>()
    var lastError: Exception? = null

    runBlocking {
        actions.map {
            deferredJobs.add(
                GlobalScope.launch {
                    withTimeout(timeout) {
                        try {
                            it()
                        } catch (e: Exception) {
                            lastError = e

                            logger.error(e)
                            logger.info("One of parallel tasks has met exception. Fail on error: $failOnError")
                        }
                    }
                }
            )
        }

        joinAll(*deferredJobs.toTypedArray())

        if (failOnError && lastError != null) { throw lastError as Exception }
    }
}