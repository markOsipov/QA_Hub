package qa_hub.service.utils

import com.google.gson.Gson
import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.result.DeleteResult
import com.mongodb.client.result.UpdateResult
import com.mongodb.reactivestreams.client.MongoClient
import com.mongodb.reactivestreams.client.MongoCollection
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.runBlocking
import org.bson.BsonDocument
import org.bson.Document
import org.litote.kmongo.coroutine.aggregate
import org.litote.kmongo.coroutine.coroutine
import org.litote.kmongo.coroutine.toList
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.CustomMongoClient
import qa_hub.core.mongo.QaHubMongoClient
import java.lang.Exception

@Service
class MongoProxyService {
    @Autowired
    lateinit var qaHubMongoClient: QaHubMongoClient

    abstract class AbstractMongoRequest{
        abstract val mongoHost: String?
        abstract val mongoUser: String?
        abstract val mongoPass: String?
        abstract val mongoAuthSource: String?
        abstract val db: String
        abstract val collection: String
    }

    data class MongoRequest(
        override val mongoHost: String? = null,
        override val mongoUser: String? = null,
        override val mongoPass: String? = null,
        override val mongoAuthSource: String? = null,
        override val db: String,
        override val collection: String,
        val filter: HashMap<String, Any>,
        val update: HashMap<String, Any>? = null,
        val upsert: Boolean? = null
    ): AbstractMongoRequest()


    data class AggregateRequest(
        override val mongoHost: String? = null,
        override val mongoUser: String? = null,
        override val mongoPass: String? = null,
        override val mongoAuthSource: String? = null,
        override val db: String,
        override val collection: String,
        val pipeline: List<String>
    ): AbstractMongoRequest()

    private fun getMongoCollection(mongoRequest: AbstractMongoRequest): MongoCollection<Document> {

            val client: MongoClient = if (mongoRequest.mongoHost == null) {
                qaHubMongoClient.client
            } else {
                CustomMongoClient(
                    mongoHost = mongoRequest.mongoHost!!,
                    mongoUser = mongoRequest.mongoUser,
                    mongoPass = mongoRequest.mongoPass,
                    authSource = mongoRequest.mongoAuthSource
                ).client
            }

            val collection = client.getDatabase(mongoRequest.db).getCollection(mongoRequest.collection)

            return collection
    }

    fun findOne(body: MongoRequest): Document? = runBlocking {
        val collection = getMongoCollection(body)

        val filter = BsonDocument.parse(Gson().toJson(body.filter))

        try {
            return@runBlocking collection.find(filter).awaitFirst()
        } catch (e: Exception) {
            return@runBlocking null
        }
    }

    fun findMany(body: MongoRequest): List<Document> = runBlocking {
        val collection = getMongoCollection(body)

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
        val collection = getMongoCollection(body)

        val filter = BsonDocument.parse(Gson().toJson(body.filter))
        val update = BsonDocument.parse(Gson().toJson(body.update))

        return@runBlocking collection.updateMany(filter, update).toList()
    }

    fun deleteOne(body: MongoRequest): DeleteResult = runBlocking {
        val collection = getMongoCollection(body)

        val filter = BsonDocument.parse(Gson().toJson(body.filter))


        return@runBlocking collection.deleteOne(filter).awaitFirst()
    }

    fun deleteMany(body: MongoRequest): List<DeleteResult> = runBlocking {
        val collection = getMongoCollection(body)

        val filter = BsonDocument.parse(Gson().toJson(body.filter))

        return@runBlocking collection.deleteMany(filter).toList()
    }

    fun aggregate(body: AggregateRequest): List<Document> = runBlocking {
        val collection = getMongoCollection(body).coroutine
        val pipeline = body.pipeline

        collection.aggregate<Document>(*pipeline.toTypedArray()).toList()
    }
}