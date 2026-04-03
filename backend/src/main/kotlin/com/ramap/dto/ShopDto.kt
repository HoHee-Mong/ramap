package com.ramap.dto

import com.ramap.model.GeoLocation
import com.ramap.model.MenuItem
import com.ramap.model.Shop

// 가게 등록 요청 DTO
data class ShopRequest(
    val name: String,
    val address: String,
    val location: GeoLocation,
    val ramenTypes: List<String>,
    val phone: String = "",
    val businessHours: String = "",
    val menu: List<MenuItem> = emptyList()
) {
    // 요청 DTO를 Shop 도큐먼트로 변환
    fun toShop() = Shop(
        name = name,
        address = address,
        location = location,
        ramenTypes = ramenTypes,
        phone = phone,
        businessHours = businessHours,
        menu = menu
    )
}

// 가게 응답 DTO
data class ShopResponse(
    val id: String,
    val name: String,
    val address: String,
    val location: GeoLocation,
    val ramenTypes: List<String>,
    val phone: String,
    val businessHours: String,
    val menu: List<MenuItem>,
    val averageRating: Double,
    val reviewCount: Int
) {
    companion object {
        // Shop 도큐먼트를 응답 DTO로 변환
        fun from(shop: Shop) = ShopResponse(
            id = shop.id!!,
            name = shop.name,
            address = shop.address,
            location = shop.location,
            ramenTypes = shop.ramenTypes,
            phone = shop.phone,
            businessHours = shop.businessHours,
            menu = shop.menu,
            averageRating = shop.averageRating,
            reviewCount = shop.reviewCount
        )
    }
}
