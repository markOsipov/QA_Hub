package qa_hub.core.mongo.utils

import java.lang.reflect.Field
import kotlin.reflect.KProperty1
import kotlin.reflect.full.memberProperties

@Suppress("UNCHECKED_CAST")
fun <R> Any.readProperty(propertyName: String): R {
    val property = this::class.members
        .first { it.name == propertyName } as KProperty1<Any, *>
    return property.get(this) as R
}

inline fun <reified R> Any.classFields(): Array<Field> {
    return R::class.java.declaredFields
}

inline fun <reified R: Any> R.getKproperties(): Collection<KProperty1<out R, *>> {
    return R::class.java.kotlin.memberProperties
}