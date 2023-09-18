package qa_hub.controller.testRuns

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import qa_hub.entity.testRun.AttachmentTypes
import qa_hub.entity.testRun.TestResultAttachment
import java.io.File
import java.util.*
import javax.imageio.ImageIO

@RestController
@RequestMapping("/api/attachments")
class AttachmentsController {
    val imageDir = System.getenv("ENV_IMAGE_DIR") ?: "${System.getProperty("user.home")}/Images/QA_Hub"
    @PostMapping("/images")
    fun postAttachments(
        @RequestParam project: String,
        @RequestParam testRunId: String,
        @RequestParam fullName: String,
        @RequestParam image: MultipartFile,
        @RequestParam(required = false, defaultValue = "jpeg") extension: String
    ): TestResultAttachment {
        val path = "$imageDir/testruns/$project/$testRunId/$fullName"
        val directory = File(path)
        if (!directory.exists()) {
            directory.mkdirs()
        }
        val fileName = "${UUID.randomUUID()}.$extension"
        val file = File("$path/$fileName")

        val result = ImageIO.write(ImageIO.read(image.inputStream), extension, file)

        if (result) {
            return TestResultAttachment(
                type = AttachmentTypes.image,
                path = "/api/attachments/images/${project}/${testRunId}/${fullName}/${fileName}",
                fileName = fileName
            )
        }

        throw Exception("Failed to save an attachment")
    }


    @GetMapping("/images/{project}/{testRunId}/{fullName}/{fileName}", produces = [MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE])
    fun getAttachment(
        @PathVariable project: String,
        @PathVariable testRunId: String,
        @PathVariable fullName: String,
        @PathVariable fileName: String,
    ): ResponseEntity<ByteArray> {
        val extension = fileName.substringAfterLast(".").lowercase()
        val mediaType = if (extension == "png") {
            MediaType.IMAGE_PNG
        } else {
            MediaType.IMAGE_JPEG
        }

        val filePath = "$imageDir/testruns/$project/$testRunId/$fullName/$fileName"
        val file = File(filePath)

        return ResponseEntity.ok()
            .contentType(mediaType)
            .body(file.readBytes())
    }
}