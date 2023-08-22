package qa_hub.service.integrations.cicd

import com.mongodb.client.result.DeleteResult
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.eq
import org.litote.kmongo.set
import org.litote.kmongo.upsert
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.core.mongo.utils.setCurrentPropertyValues

@Service
class CicdService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val cicdIntegrationsCollection by lazy {
        mongoClient.db.getCollection<CicdInfo>(Collections.CICD_INTEGRATIONS.collectionName)
    }

    fun getCicdIntegrations(): List<CicdInfo> = runBlocking {
        cicdIntegrationsCollection.find().toList()
    }

    fun addCicdIntegration(integration: CicdInfo): CicdInfo = runBlocking {
        val integrations = getCicdIntegrations()
        if (integrations.firstOrNull { it.cicdType == integration.cicdType } == null) {
            cicdIntegrationsCollection.insertOne(integration)

            return@runBlocking cicdIntegrationsCollection.findOne(
                CicdInfo::cicdType.eq(integration.cicdType)
            )!!
        } else {
            throw Exception("Integration type is not unique")
        }
    }

    fun updateCicdIntegration(integration: CicdInfo): CicdInfo = runBlocking {
        cicdIntegrationsCollection.updateOneById(
            integration._id!!,
            set(
                *(integration.setCurrentPropertyValues(skipProperties = listOf("_id")))
            ),
            upsert()
        )

        return@runBlocking cicdIntegrationsCollection.findOne(
            CicdInfo::cicdType.eq(integration.cicdType)
        )!!
    }

    fun deleteCicdIntegration(id: String): DeleteResult = runBlocking {
        cicdIntegrationsCollection.deleteOne(
            CicdInfo::_id.eq(id)
        )
    }

    fun deleteAllCicdIntegrations(): DeleteResult = runBlocking {
        cicdIntegrationsCollection.deleteMany()
    }
}