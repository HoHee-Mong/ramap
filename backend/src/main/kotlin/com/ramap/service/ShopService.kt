package com.ramap.service

import com.ramap.dto.CategoryInfo
import com.ramap.dto.ShopRequest
import com.ramap.dto.ShopResponse
import com.ramap.model.Category
import com.ramap.model.Shop
import com.ramap.repository.CategoryRepository
import com.ramap.repository.ShopRepository
import org.springframework.stereotype.Service
import kotlin.math.*

// 가게 비즈니스 로직
@Service
class ShopService(
    private val shopRepository: ShopRepository,
    private val categoryRepository: CategoryRepository
) {

    // approved 상태 가게 목록 조회 (카테고리/텍스트 검색 지원)
    fun getShops(categoryId: String?, q: String?): List<ShopResponse> {
        val allCategories = categoryRepository.findAll()
        val shops = when {
            // 텍스트 검색: 이름 또는 주소 포함 검색 후 approved 필터
            q != null -> shopRepository
                .findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(q, q)
                .filter { it.status == "approved" }
            // 카테고리 + approved 복합 조회
            categoryId != null -> shopRepository.findByCategoryIdsContainingAndStatus(categoryId, "approved")
            // 전체 approved 가게
            else -> shopRepository.findByStatus("approved")
        }
        return shops.map { toResponse(it, allCategories) }
    }

    // 단건 가게 조회 (상태 무관)
    fun getShopById(id: String): ShopResponse {
        val shop = shopRepository.findById(id)
            .orElseThrow { NoSuchElementException("가게를 찾을 수 없습니다. id=$id") }
        val allCategories = categoryRepository.findAll()
        return toResponse(shop, allCategories)
    }

    // 가게 등록 (status 기본값 "pending")
    fun createShop(request: ShopRequest): ShopResponse {
        val saved = shopRepository.save(request.toShop())
        val allCategories = categoryRepository.findAll()
        return toResponse(saved, allCategories)
    }

    // 위치 기반 주변 가게 조회 (Haversine 공식, approved만)
    fun getNearbyShops(lat: Double, lng: Double, radiusKm: Double): List<ShopResponse> {
        val allCategories = categoryRepository.findAll()
        return shopRepository.findByStatus("approved")
            .map { shop ->
                val distance = haversineDistance(lat, lng, shop.location.lat, shop.location.lng)
                Pair(shop, distance)
            }
            .filter { (_, distance) -> distance <= radiusKm }
            .sortedBy { (_, distance) -> distance }
            .map { (shop, distance) ->
                toResponse(shop, allCategories).copy(distanceKm = distance)
            }
    }

    // Haversine 공식으로 두 좌표 사이의 거리 계산 (km)
    private fun haversineDistance(lat1: Double, lng1: Double, lat2: Double, lng2: Double): Double {
        val R = 6371.0
        val dLat = Math.toRadians(lat2 - lat1)
        val dLng = Math.toRadians(lng2 - lng1)
        val a = sin(dLat / 2).pow(2) +
                cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) * sin(dLng / 2).pow(2)
        return R * 2 * atan2(sqrt(a), sqrt(1 - a))
    }

    // Shop 도큐먼트를 응답 DTO로 변환 (카테고리 이름 포함)
    fun toResponse(shop: Shop, allCategories: List<Category>): ShopResponse {
        val categoryMap = allCategories.associateBy { it.id!! }
        val categories = shop.categoryIds.mapNotNull { id ->
            categoryMap[id]?.let { CategoryInfo(it.id!!, it.name) }
        }
        return ShopResponse(
            id = shop.id!!,
            name = shop.name,
            address = shop.address,
            location = shop.location,
            categories = categories,
            phone = shop.phone,
            businessHours = shop.businessHours,
            menu = shop.menu,
            averageRating = shop.averageRating,
            reviewCount = shop.reviewCount,
            status = shop.status
        )
    }
}
