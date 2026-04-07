package com.ramap.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

// 카테고리 MongoDB 도큐먼트
@Document(collection = "categories")
data class Category(
    @Id val id: String? = null,
    val name: String,
    val description: String = "",
    val createdAt: LocalDateTime = LocalDateTime.now()
)
