package com.ramap.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

// 회원가입 요청 DTO
data class SignupRequest(
    @field:Email(message = "이메일 형식이 올바르지 않습니다")
    @field:NotBlank(message = "이메일을 입력해주세요")
    val email: String,

    @field:NotBlank(message = "비밀번호를 입력해주세요")
    @field:Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다")
    val password: String,

    @field:NotBlank(message = "닉네임을 입력해주세요")
    @field:Size(min = 2, max = 20, message = "닉네임은 2~20자 사이여야 합니다")
    val nickname: String
)

// 로그인 요청 DTO
data class LoginRequest(
    @field:Email(message = "이메일 형식이 올바르지 않습니다")
    @field:NotBlank(message = "이메일을 입력해주세요")
    val email: String,

    @field:NotBlank(message = "비밀번호를 입력해주세요")
    val password: String
)

// 인증 성공 응답 DTO
data class AuthResponse(
    val token: String,
    val email: String,
    val nickname: String
)

// /me 엔드포인트 응답 DTO
data class UserInfoResponse(
    val id: String,
    val email: String,
    val nickname: String
)
