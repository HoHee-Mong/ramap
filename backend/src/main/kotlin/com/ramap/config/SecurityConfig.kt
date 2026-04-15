package com.ramap.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.ramap.dto.ApiResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

// Spring Security 필터 체인 설정
@Configuration
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
    private val objectMapper: ObjectMapper
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        // 인증 실패 시 ApiResponse 형식으로 401 반환
        val authEntryPoint = org.springframework.security.web.AuthenticationEntryPoint { _, response, _ ->
            response.status = 401
            response.contentType = MediaType.APPLICATION_JSON_VALUE
            response.characterEncoding = "UTF-8"
            response.writer.write(objectMapper.writeValueAsString(ApiResponse.fail("로그인이 필요합니다")))
        }

        http
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .exceptionHandling { it.authenticationEntryPoint(authEntryPoint) }
            .authorizeHttpRequests { auth ->
                // 인증 없이 허용
                auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                auth.requestMatchers("/api/v1/auth/signup", "/api/v1/auth/login").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/v1/ramen-shops/**").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/v1/reviews/**").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                // 관리자만 허용
                auth.requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.POST, "/api/v1/categories/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.PUT, "/api/v1/categories/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.DELETE, "/api/v1/categories/**").hasRole("ADMIN")
                // 로그인 필요
                auth.requestMatchers("/api/v1/auth/me").authenticated()
                auth.requestMatchers(HttpMethod.POST, "/api/v1/ramen-shops").authenticated()
                auth.requestMatchers(HttpMethod.POST, "/api/v1/reviews/**").authenticated()
                auth.requestMatchers("/api/v1/favorites/**").authenticated()
                auth.anyRequest().permitAll()
            }
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }
}
