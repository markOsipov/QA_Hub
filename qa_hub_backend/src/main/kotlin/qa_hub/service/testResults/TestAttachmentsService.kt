package qa_hub.service.testResults

import com.mongodb.client.model.Filters.and
import com.mongodb.client.result.UpdateResult
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.eq
import org.litote.kmongo.push
import org.litote.kmongo.upsert
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import qa_hub.controller.testRuns.attachmentsDir
import qa_hub.core.mongo.QaHubMongoClient
import qa_hub.core.mongo.entity.Collections
import qa_hub.entity.testRun.AttachmentTypes
import qa_hub.entity.testRun.TestResultAttachment
import java.io.File
import java.util.*
import javax.imageio.ImageIO

@Service
class TestAttachmentsService {
    @Autowired
    lateinit var mongoClient: QaHubMongoClient

    private val testAttachmentsCollection by lazy {
        mongoClient.db.getCollection<TestAttachments>(Collections.TEST_ATTACHMENTS.collectionName)
    }

    fun postTextAttachment(
         project: String,
         testRunId: String,
         fullName: String,
         retry: Int,
         text: MultipartFile,
         fileName: String
    ): TestResultAttachment {
        val fullNameFixed = fullName.replace("::", ".").replace("/", ".")

        val path = "$attachmentsDir/testruns/$project/$testRunId/$fullNameFixed/Retry_${retry}"
        val directory = File(path)
        if (!directory.exists()) {
            directory.mkdirs()
        }

        val file = File("$path/$fileName")

        file.writeText(String(text.bytes))

        val attachment = TestResultAttachment(
            type = AttachmentTypes.text,
            path = "/api/attachments/text/${project}/${testRunId}/${fullNameFixed}/Retry_${retry}/${fileName}",
            fileName = fileName
        )

        insertTestAttachment(
            project = project,
            testRunId = testRunId,
            fullName = fullName,
            retry = retry,
            testResultAttachment = attachment
        )

        return attachment
    }

    fun postImageAttachment(
        project: String,
        testRunId: String,
        fullName: String,
        retry: Int,
        image: MultipartFile,
        extension: String
    ): TestResultAttachment {
        val fullNameFixed = fullName.replace("::", ".").replace("/", ".")

        val path = "$attachmentsDir/testruns/$project/$testRunId/$fullNameFixed/Retry_${retry}"
        val directory = File(path)
        if (!directory.exists()) {
            directory.mkdirs()
        }
        val fileName = "${UUID.randomUUID()}.$extension"
        val file = File("$path/$fileName")

        val result = ImageIO.write(ImageIO.read(image.inputStream), extension, file)

        if (result) {
            val attachment = TestResultAttachment(
                type = AttachmentTypes.image,
                path = "/api/attachments/images/${project}/${testRunId}/${fullNameFixed}/Retry_${retry}/${fileName}",
                fileName = fileName
            )

            insertTestAttachment(
                project = project,
                testRunId = testRunId,
                fullName = fullName,
                retry = retry,
                testResultAttachment = attachment
            )

            return attachment
        }
        throw Exception("Failed to save an attachment")
    }

    fun getTestAttachmentsList(
        testRunId: String,
        fullName: String,
        retry: Int
    ): TestAttachments? = runBlocking {
        val testAttachments = testAttachmentsCollection.findOne(
            and(
                TestAttachments::testRunId eq testRunId,
                TestAttachments::fullName eq fullName,
                TestAttachments::retry eq retry,
            )
        )

        return@runBlocking testAttachments
    }

    private fun insertTestAttachment(
        project: String,
        testRunId: String,
        fullName: String,
        retry: Int,
        testResultAttachment: TestResultAttachment
    ): UpdateResult = runBlocking {
        testAttachmentsCollection.updateOne(
            and(
                TestAttachments::project eq project,
                TestAttachments::testRunId eq testRunId,
                TestAttachments::fullName eq fullName,
                TestAttachments::retry eq retry,
            ),
            push( TestAttachments::attachments, testResultAttachment),
            upsert()
        )
    }

    data class TestAttachments(
        val project: String,
        val testRunId: String,
        val fullName: String,
        val retry: Int = 0,
        val attachments: List<TestResultAttachment> = mutableListOf()
    )
}