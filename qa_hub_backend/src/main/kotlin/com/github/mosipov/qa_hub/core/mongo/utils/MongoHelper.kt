package com.github.mosipov.qa_hub.core.mongo.utils

import org.litote.kmongo.SetTo
import org.litote.kmongo.setTo

inline fun <reified R: Any> R.setCurrentPropertyValues(skipProperties: List<String> = listOf()): Array<SetTo<Any?>> {
    val result = mutableListOf<SetTo<Any?>>()

    this.getKproperties().filter{ !skipProperties.contains(it.name) }.forEach { property ->
        result.add(property.setTo(this.readProperty(property.name)))
    }

    return result.toTypedArray()
}

