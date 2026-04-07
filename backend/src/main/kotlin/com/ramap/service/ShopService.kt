package com.ramap.service

import com.ramap.dto.CategoryInfo
import com.ramap.dto.ShopRequest
import com.ramap.dto.ShopResponse
import com.ramap.model.Category
import com.ramap.model.Shop
import com.ramap.repository.CategoryRepository
import com.ramap.repository.ShopRepository
import org.springframework.stereotype.Service

// 가게 비즈니스 로직
@Service
class ShopService(
    private val shopRepository: ShopRepository,
    private val categoryRepository: CategoryRepository
) {

    // 전체 또는 카테고리별 가게 목록 조회
    fun getShops(categoryId: String?): List<ShopResponse> {
        val shops = if (categoryId != null) {
            shopRepository.findByCategoryIdsContaining(categoryId)
        } else {
            shopRepository.findAll()
        }
        val allCategories = categoryRepository.findAll()
        return shops.map { toResponse(it, allCategories) }
    }

    // 단건 가게 조회
    fun getShopById(id: String): ShopResponse {
        val shop = shopRepository.findById(id)
            .orElseThrow { NoSuchElementException("가게를 찾을 수 없습니다. id=$id") }
        val allCategories = categoryRepository.findAll()
        return toResponse(shop, allCategories)
    }

    // 가게 등록
    fun createShop(request: ShopRequest): ShopResponse {
        val saved = shopRepository.save(request.toShop())
        val allCategories = categoryRepository.findAll()
        return toResponse(saved, allCategories)
    }

    // Shop 도큐먼트를 응답 DTO로 변환 (카테고리 이름 포함)
    private fun toResponse(shop: Shop, allCategories: List<Category>): ShopResponse {
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
            reviewCount = shop.reviewCount
        )
    }
}
