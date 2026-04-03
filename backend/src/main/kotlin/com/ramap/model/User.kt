package com.ramap.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

// MongoDB users 컬렉션 도큐먼트 모델
@Document(collection = "users")
data class User(
    @Id val id: String? = null,
    @Indexed(unique = true) val email: String,
    val password: String, // BCrypt 해싱된 비밀번호
    val nickname: String,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
