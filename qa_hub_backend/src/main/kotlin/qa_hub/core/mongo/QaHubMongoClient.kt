package qa_hub.core.mongo

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.MongoCredential
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.litote.kmongo.coroutine.coroutine
import org.litote.kmongo.reactivestreams.KMongo
import org.springframework.stereotype.Repository

@Repository
class QaHubMongoClient {
    private val qaHubDb = "dbQaHub"

    private val mongoHost = System.getenv("ENV_MONGO_QA_HUB_HOST")
    private val userName = System.getenv("ENV_MONGO_QA_HUB_LOGIN")
    private val userPass = System.getenv("ENV_MONGO_QA_HUB_PASSWORD")
    private val authSource = System.getenv("ENV_MONGO_QA_HUB_AUTH_SOURCE")

    val client = run {
        val builder = MongoClientSettings.builder()
        builder.applyConnectionString(ConnectionString(mongoHost))

        if (!userName.isNullOrEmpty() && userPass.isNullOrEmpty()) {
            builder.credential(
                MongoCredential.createScramSha1Credential(
                    userName,
                    authSource ?: "admin",
                    userPass.toCharArray()
                )
            )
        }
        KMongo.createClient(builder.build())
    }

    val db: CoroutineDatabase = client.coroutine.getDatabase(qaHubDb)
}