package com.ramap.service

import com.ramap.config.JwtUtil
import com.ramap.dto.AuthResponse
import com.ramap.dto.LoginRequest
import com.ramap.dto.SignupRequest
import com.ramap.dto.UserInfoResponse
import com.ramap.exception.AuthenticationException
import com.ramap.model.User
import com.ramap.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

// 회원가입/로그인 비즈니스 로직
@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtil: JwtUtil
) {

    // 회원가입: 이메일 중복 확인 → 비밀번호 해싱 → 저장 → 토큰 발급
    fun signup(request: SignupRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("이미 사용 중인 이메일입니다")
        }
        val user = User(
            email = request.email,
            password = passwordEncoder.encode(request.password),
            nickname = request.nickname
        )
        userRepository.save(user)
        val token = jwtUtil.generateToken(request.email)
        return AuthResponse(token = token, email = request.email, nickname = request.nickname)
    }

    // 로그인: 이메일 조회 → 비밀번호 검증 → 토큰 발급
    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            ?: throw AuthenticationException("이메일 또는 비밀번호가 올바르지 않습니다")
        if (!passwordEncoder.matches(request.password, user.password)) {
            throw AuthenticationException("이메일 또는 비밀번호가 올바르지 않습니다")
        }
        val token = jwtUtil.generateToken(request.email)
        return AuthResponse(token = token, email = user.email, nickname = user.nickname)
    }

    // 이메일로 유저 정보 조회
    fun getUserInfo(email: String): UserInfoResponse {
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("유저를 찾을 수 없습니다")
        return UserInfoResponse(id = user.id!!, email = user.email, nickname = user.nickname)
    }
}
