package com.ramap.controller

import com.ramap.dto.ApiResponse
import com.ramap.dto.LoginRequest
import com.ramap.dto.SignupRequest
import com.ramap.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

// 인증 관련 API 엔드포인트
@RestController
@RequestMapping("/api/v1/auth")
class AuthController(private val authService: AuthService) {

    // 회원가입
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    fun signup(@Valid @RequestBody request: SignupRequest): ApiResponse<*> {
        val response = authService.signup(request)
        return ApiResponse.ok(response)
    }

    // 로그인
    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ApiResponse<*> {
        val response = authService.login(request)
        return ApiResponse.ok(response)
    }

    // 현재 로그인한 유저 정보 조회 (토큰 필요)
    @GetMapping("/me")
    fun getMe(@AuthenticationPrincipal userDetails: UserDetails): ApiResponse<*> {
        val userInfo = authService.getUserInfo(userDetails.username)
        return ApiResponse.ok(userInfo)
    }
}
