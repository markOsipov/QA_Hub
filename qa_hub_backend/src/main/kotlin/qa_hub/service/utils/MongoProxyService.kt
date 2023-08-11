package qa_hub.service.utils

import com.google.gson.Gson
import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.result.DeleteResult
import com.mongodb.client.result.UpdateResult
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.runBlocking
import org.bson.BsonDocument
import org.bson.Document
import org.litote.kmongo.coroutine.toList
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import java.lang.Exception

@Service
class MongoProxyService {
    @Autowired
    lateinit var qaHubMongoClient: QaHubMongoClient

    data class MongoRequest(
            val db: String,
            val collection: String,
            val filter: HashMap<String, Any>,
            val update: HashMap<String, Any>? = null,
            val upsert: Boolean? = null
    )

    fun findOne(body: MongoRequest): Document? = runBlocking {
        val db = qaHubMongoClient.client.getDatabase(body.db)
        val collection = db.getCollection(body.collection)

        val filter = BsonDocument.parse(Gson().toJson(body.filter))

        try {
            return@runBlocking collection.find(filter).awaitFirst()
        } catch (e: Exception) {
            return@runBlocking null
        }
    }

    fun findMany(body: MongoRequest): List<Document> = runBlocking {
        val db = qaHubMongoClient.client.getDatabase(body.db)
        val collection = db.getCollection(body.collection)

        val filter = BsonDocument.parse(Gson().toJson(body.filter))

        return@runBlocking collection.find(filter).toList()
    }

    fun updateOne(body: MongoRequest): UpdateResult = runBlocking {
        val db = qaHubMongoClient.client.getDatabase(body.db)
        val collection = db.getCollection(body.collection)

        val filter = BsonDocument.parse(Gson().toJson(body.filter))
        val update = BsonDocument.parse(Gson().toJson(body.update))

        return@runBlocking collection.updateOne(filter, update, UpdateOptions().upsert(body.upsert == true)).awaitFirst()
    }

    fun updateMany(body: MongoRequest): List<UpdateResult> = runBlocking {
        val db = qaHubMongoClient.client.getDatabase(body.db)
        val collection = db.getCollection(body.collection)

        val filter = BsonDocument.parse(Gson().toJson(body.filter))
        val update = BsonDocument.parse(Gson().toJson(body.update))

        return@runBlocking collection.updateMany(filter, update).toList()
    }

    fun deleteOne(body: MongoRequest): DeleteResult = runBlocking {
        val db = qaHubMongoClient.client.getDatabase(body.db)
        val collection = db.getCollection(body.collection)

        val filter = BsonDocument.parse(Gson().toJson(body.filter))


        return@runBlocking collection.deleteOne(filter).awaitFirst()
    }

    fun deleteMany(body: MongoRequest): List<DeleteResult> = runBlocking {
        val db = qaHubMongoClient.client.getDatabase(body.db)
        val collection = db.getCollection(body.collection)

        val filter = BsonDocument.parse(Gson().toJson(body.filter))

        return@runBlocking collection.deleteMany(filter).toList()
    }
}