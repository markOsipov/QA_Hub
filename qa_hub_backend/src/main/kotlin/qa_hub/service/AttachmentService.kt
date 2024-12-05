package qa_hub.service

import org.springframework.stereotype.Service
import qa_hub.controller.testRuns.imageDir
import qa_hub.entity.testRun.AttachmentTypes
import qa_hub.entity.testRun.TestResultAttachment
import java.awt.image.BufferedImage
import java.io.File
import java.util.*
import javax.imageio.ImageIO


@Service
class AttachmentService {

    fun saveImage(
        project: String,
        testRunId: String,
        fullName: String,
        bufferedImage: BufferedImage,
        extension: String
    ): TestResultAttachment {
        val path = "$imageDir/testruns/$project/$testRunId/$fullName"
        val directory = File(path)
        if (!directory.exists()) {
            directory.mkdirs()
        }
        val fileName = "${UUID.randomUUID()}.$extension"
        val file = File("$path/$fileName")

        val result = ImageIO.write(bufferedImage, extension, file)

        if (result) {
            return TestResultAttachment(
                type = AttachmentTypes.image,
                path = "/api/attachments/images/${project}/${testRunId}/${fullName}/${fileName}",
                fileName = fileName
            )
        }

        throw Exception("Failed to save an attachment")
    }
}