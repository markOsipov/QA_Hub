package com.github.mosipov.qa_hub

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class QaHubBackendApplication

fun main(args: Array<String>) {
    runApplication<QaHubBackendApplication>(*args)
}
