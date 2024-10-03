package qa_hub.core.mongo

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.MongoCredential
import org.litote.kmongo.reactivestreams.KMongo

class CustomMongoClient(
    private val mongoHost: String,
    private val mongoUser: String? = null,
    private val mongoPass: String? = null,
    private val authSource: String? = null
) {
    val client = run {
        val builder = MongoClientSettings.builder()
        builder.applyConnectionString(ConnectionString(mongoHost))
        builder.retryWrites(false)

        if (!mongoUser.isNullOrEmpty() && !mongoPass.isNullOrEmpty()) {
            builder.credential(
                MongoCredential.createScramSha1Credential(
                    mongoUser,
                    authSource ?: "admin",
                    mongoPass.toCharArray()
                )
            )
        }

        KMongo.createClient(builder.build())
    }
}