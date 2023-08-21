package qa_hub.core.mongo.utils

import org.bson.conversions.Bson
import java.lang.reflect.Field
import kotlin.reflect.KProperty
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

infix fun <T> KProperty<T>.divide(property: KProperty<T>): Bson =
    divide(this, property )