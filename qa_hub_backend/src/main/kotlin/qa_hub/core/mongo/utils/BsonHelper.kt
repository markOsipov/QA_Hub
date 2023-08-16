package qa_hub.core.mongo.utils

import org.bson.conversions.Bson
import org.litote.kmongo.bson
import org.litote.kmongo.path
import kotlin.reflect.KProperty

fun <T1, T2> divide(val1: KProperty<T1>, val2: KProperty<T2>): Bson =
    "{ ${'$'}divide: [\"${'$'}${val1.path()}\", \"${'$'}${val2.path()}\"] }".bson