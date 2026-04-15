package com.ramap.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

// CORS 설정 (프론트엔드 개발 서버 허용)
@Configuration
class CorsConfig : WebMvcConfigurer {

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:5173",
                "https://ramap-4up2yb0jl-hohee-mongs-projects.vercel.app",
                "https://ramapp.vercel.app"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowCredentials(true)
            .allowedHeaders("*")
    }
}
