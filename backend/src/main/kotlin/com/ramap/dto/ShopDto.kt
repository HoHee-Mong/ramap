package com.ramap.dto

import com.ramap.model.GeoLocation
import com.ramap.model.MenuItem
import com.ramap.model.Shop

// 가게 등록 요청 DTO
data class ShopRequest(
    val name: String,
    val address: String,
    val location: GeoLocation,
    val categoryIds: List<String>,
    val phone: String = "",
    val businessHours: String = "",
    val menu: List<MenuItem> = emptyList()
) {
    // 요청 DTO를 Shop 도큐먼트로 변환
    fun toShop() = Shop(
        name = name,
        address = address,
        location = location,
        categoryIds = categoryIds,
        phone = phone,
        businessHours = businessHours,
        menu = menu
    )
}

// 가게 응답에 포함되는 카테고리 정보
data class CategoryInfo(val id: String, val name: String)

// 가게 응답 DTO
data class ShopResponse(
    val id: String,
    val name: String,
    val address: String,
    val location: GeoLocation,
    val categories: List<CategoryInfo>,
    val phone: String,
    val businessHours: String,
    val menu: List<MenuItem>,
    val averageRating: Double,
    val reviewCount: Int
)
