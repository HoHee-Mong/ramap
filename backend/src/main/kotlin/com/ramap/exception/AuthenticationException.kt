package com.ramap.exception

// 인증 실패 시 사용하는 커스텀 예외 (401 반환용)
class AuthenticationException(message: String) : RuntimeException(message)
