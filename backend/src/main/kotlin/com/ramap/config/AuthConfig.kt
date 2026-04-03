package com.ramap.config

import com.ramap.repository.UserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

// PasswordEncoder 및 UserDetailsService 빈 분리 설정 (SecurityConfig 순환 참조 방지)
@Configuration
class AuthConfig(private val userRepository: UserRepository) {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    // 이메일 기반 유저 조회 (JwtAuthenticationFilter에서 사용)
    @Bean
    fun userDetailsService(): UserDetailsService {
        return UserDetailsService { email ->
            val user = userRepository.findByEmail(email)
                ?: throw UsernameNotFoundException("유저를 찾을 수 없습니다: $email")
            User.withUsername(user.email)
                .password(user.password)
                .roles("USER")
                .build()
        }
    }
}
