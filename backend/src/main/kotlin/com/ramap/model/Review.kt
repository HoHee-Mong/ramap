package com.ramap.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

// 리뷰 MongoDB 도큐먼트
@Document(collection = "reviews")
data class Review(
    @Id
    val id: String? = null,
    val shopId: String,
    val authorNickname: String,
    val rating: Int,
    val content: String,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
