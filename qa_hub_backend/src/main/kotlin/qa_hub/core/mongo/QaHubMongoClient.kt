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

    val client = run {
        KMongo.createClient(
                MongoClientSettings.builder()
                        .applyConnectionString(ConnectionString(mongoHost))
                        .credential(
                                MongoCredential.createScramSha1Credential(
                                        userName,
                                        "admin",
                                        userPass.toCharArray()
                                )
                        )
                        .build()
        )
    }

    val db: CoroutineDatabase = client.coroutine.getDatabase(qaHubDb)
}