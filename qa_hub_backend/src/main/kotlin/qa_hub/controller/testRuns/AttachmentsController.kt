package qa_hub.controller.testRuns

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import qa_hub.entity.testRun.TestResultAttachment
import qa_hub.service.AttachmentService
import java.io.File
import javax.imageio.ImageIO

val imageDir = System.getenv("ENV_IMAGE_DIR") ?: "${System.getProperty("user.home")}/Images/QA_Hub"
@RestController
@RequestMapping("/api/attachments")
class AttachmentsController {
    @Autowired
    lateinit var attachmentService: AttachmentService

    @PostMapping("/images")
    fun postAttachments(
        @RequestParam project: String,
        @RequestParam testRunId: String,
        @RequestParam fullName: String,
        @RequestParam image: MultipartFile,
        @RequestParam(required = false, defaultValue = "jpeg") extension: String
    ): TestResultAttachment {
        val bufferedImage = ImageIO.read(image.inputStream)

        return attachmentService.saveImage(project, testRunId, fullName, bufferedImage, extension)
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