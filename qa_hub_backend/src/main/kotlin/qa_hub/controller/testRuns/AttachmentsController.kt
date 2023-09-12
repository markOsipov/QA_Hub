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

    @PostMapping("/images")
    fun postAttachments(
        @RequestParam project: String,
        @RequestParam testRunId: String,
        @RequestParam fullName: String,
        @RequestParam image: MultipartFile
    ): TestResultAttachment {
        val userHomeDir = System.getProperty("user.home")
        val path = "$userHomeDir/Images/QA_Hub/testruns/$project/$testRunId/$fullName"
        val directory = File(path)
        if (!directory.exists()) {
            directory.mkdirs()
        }
        val fileName = "${UUID.randomUUID()}.png"
        val file = File("$path/$fileName")

        val result = ImageIO.write(ImageIO.read(image.inputStream), "png", file)

        if (result) {
            return TestResultAttachment(
                type = AttachmentTypes.image,
                path = path,
                fileName = fileName
            )
        }

        throw Exception("Failed to save an attachment")
    }


    @GetMapping("/images/{project}/{testRunId}/{fullName}/{fileName}", produces = [MediaType.IMAGE_PNG_VALUE])
    fun getAttachment(
        @PathVariable project: String,
        @PathVariable testRunId: String,
        @PathVariable fullName: String,
        @PathVariable fileName: String,
    ): ResponseEntity<ByteArray> {
        val userHomeDir = System.getProperty("user.home")
        val filePath = "$userHomeDir/Images/QA_Hub/testruns/$project/$testRunId/$fullName/$fileName"
        val file = File(filePath)

        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(file.readBytes())
    }
}