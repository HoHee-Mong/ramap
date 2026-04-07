package com.ramap.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

// 가게 위치 좌표
data class GeoLocation(
    val lat: Double,
    val lng: Double
)

// 가게 메뉴 항목
data class MenuItem(
    val name: String,
    val price: Int
)

// 라멘 가게 MongoDB 도큐먼트
@Document(collection = "shops")
data class Shop(
    @Id
    val id: String? = null,
    val name: String,
    val address: String,
    val location: GeoLocation,
    val categoryIds: List<String> = emptyList(),
    val phone: String = "",
    val businessHours: String = "",
    val menu: List<MenuItem> = emptyList(),
    val averageRating: Double = 0.0,
    val reviewCount: Int = 0,
    val status: String = "pending", // pending | approved | rejected
    val createdAt: LocalDateTime = LocalDateTime.now()
)
