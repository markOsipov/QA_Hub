package qa_hub.service

import kotlinx.coroutines.runBlocking
import org.litote.kmongo.eq
import org.litote.kmongo.set
import org.litote.kmongo.upsert
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.utils.setCurrentPropertyValues
import qa_hub.entity.QaHubConfig

//Store for all configurable things - projects, env variables, credentials for side services

@Service
class QaHubConfigService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val qaHubConfigCollection by lazy {
        mongoClient.db.getCollection<QaHubConfig>("qaHubConfig")
    }

    fun getConfigs(): List<QaHubConfig> = runBlocking {
        qaHubConfigCollection.find().toList().sortedBy { it.isCustom }
    }

    fun getSpecificConfig(configName: String): QaHubConfig = runBlocking {
        qaHubConfigCollection
            .find(QaHubConfig::configName.eq(configName))
            .toList()
            .first()
    }

    fun upsertConfig(config: QaHubConfig) = runBlocking {
        qaHubConfigCollection.updateOne(
            QaHubConfig::configName.eq(config.configName),
            set(
                *(config.setCurrentPropertyValues(skipProperties = listOf("_id")))
            ),
            upsert()
        )
    }

    fun deleteConfig(configName: String) = runBlocking {
        qaHubConfigCollection.deleteMany(
            QaHubConfig::configName.eq(configName)
        )
    }

    fun deleteAllConfigs() = runBlocking {
        qaHubConfigCollection.deleteMany()
    }
}

