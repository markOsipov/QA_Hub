package qa_hub.service.integrations.tms

import com.mongodb.client.result.DeleteResult
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.eq
import org.litote.kmongo.set
import org.litote.kmongo.upsert
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections.TMS_INTEGRATIONS
import qa_hub.core.mongo.utils.setCurrentPropertyValues
import qa_hub.service.utils.CachedIntegrationInfoService

@Service
class TmsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    @Autowired
    lateinit var cachedInts: CachedIntegrationInfoService

    private val tmsIntegrationsCollection by lazy {
        mongoClient.db.getCollection<TmsInfo>(TMS_INTEGRATIONS.collectionName)
    }

    fun getTmsIntegrations(): List<TmsInfo> = runBlocking {
        tmsIntegrationsCollection.find().toList()
    }

    fun addTmsIntegration(integration: TmsInfo): TmsInfo = runBlocking {
        val integrations = getTmsIntegrations()
        if (integrations.firstOrNull { it.tmsType == integration.tmsType } == null) {
            tmsIntegrationsCollection.insertOne(integration)

            cachedInts.prjTmsInts = mutableMapOf()

            return@runBlocking tmsIntegrationsCollection.findOne(
                TmsInfo::tmsType.eq(integration.tmsType)
            )!!
        } else {
            throw Exception("Integration type is not unique")
        }
    }

    fun updateTmsIntegration(integration: TmsInfo): TmsInfo = runBlocking {
        tmsIntegrationsCollection.updateOneById(
            integration._id!!,
            set(
                *(integration.setCurrentPropertyValues(skipProperties = listOf("_id")))
            ),
            upsert()
        )

        cachedInts.prjTmsInts = mutableMapOf()

        return@runBlocking tmsIntegrationsCollection.findOne(
            TmsInfo::tmsType.eq(integration.tmsType)
        )!!
    }

    fun deleteTmsIntegration(id: String): DeleteResult = runBlocking {
        val result = tmsIntegrationsCollection.deleteOne(
            TmsInfo::_id.eq(id)
        )

        cachedInts.prjTmsInts = mutableMapOf()

        return@runBlocking result
    }

    fun deleteAllTmsIntegrations(): DeleteResult = runBlocking {
        val result = tmsIntegrationsCollection.deleteMany()

        cachedInts.prjTmsInts = mutableMapOf()

        return@runBlocking result
    }
}