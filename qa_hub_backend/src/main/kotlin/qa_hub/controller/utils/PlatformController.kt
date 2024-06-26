package qa_hub.controller.utils

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import qa_hub.entity.Platform
import qa_hub.entity.Platforms

@RestController
@RequestMapping("/api/platforms")
class PlatformController {

    @GetMapping("")
    fun getPlatforms(): List<Platform> {
        return Platforms.values().map{ it.platform }
    }
}