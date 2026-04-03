package com.ramap.dto

// API 공통 응답 형식
data class ApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val message: String = ""
) {
    companion object {
        // 성공 응답 생성
        fun <T> ok(data: T) = ApiResponse(success = true, data = data)

        // 메시지만 있는 성공 응답 생성
        fun success(message: String) = ApiResponse<Unit>(success = true, message = message)

        // 실패 응답 생성
        fun fail(message: String) = ApiResponse<Unit>(success = false, message = message)
    }
}
