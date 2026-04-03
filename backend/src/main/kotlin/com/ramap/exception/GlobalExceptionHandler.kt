package com.ramap.exception

import com.ramap.dto.ApiResponse
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

// 전역 예외 처리 핸들러
@RestControllerAdvice
class GlobalExceptionHandler {

    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    // @Valid 유효성 검사 실패 시 (별점 범위, 필수값 등)
    @ExceptionHandler(MethodArgumentNotValidException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleValidation(exception: MethodArgumentNotValidException): ApiResponse<Unit> {
        val message = exception.bindingResult.fieldErrors.firstOrNull()?.defaultMessage ?: "입력값이 올바르지 않습니다."
        return ApiResponse.fail(message)
    }

    // 리소스를 찾을 수 없을 때
    @ExceptionHandler(NoSuchElementException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleNotFound(exception: NoSuchElementException): ApiResponse<Unit> {
        return ApiResponse.fail(exception.message ?: "리소스를 찾을 수 없습니다.")
    }

        // 인증 실패 (이메일/비밀번호 불일치)
    @ExceptionHandler(AuthenticationException::class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    fun handleAuthenticationFailure(exception: AuthenticationException): ApiResponse<Unit> {
        return ApiResponse.fail(exception.message ?: "인증에 실패했습니다.")
    }

    // 잘못된 요청
    @ExceptionHandler(IllegalArgumentException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleBadRequest(exception: IllegalArgumentException): ApiResponse<Unit> {
        return ApiResponse.fail(exception.message ?: "잘못된 요청입니다.")
    }

    // 서버 내부 오류
    @ExceptionHandler(Exception::class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    fun handleServerError(exception: Exception): ApiResponse<Unit> {
        logger.error("서버 내부 오류 발생: ${exception.javaClass.name}: ${exception.message}", exception)
        return ApiResponse.fail("서버 오류가 발생했습니다.")
    }
}
