package com.ramap.service

import com.ramap.dto.ShopRequest
import com.ramap.dto.ShopResponse
import com.ramap.repository.CategoryRepository
import com.ramap.repository.ShopRepository
import org.springframework.stereotype.Service

// 관리자 전용 가게 관리 비즈니스 로직
@Service
class AdminService(
    private val shopRepository: ShopRepository,
    private val categoryRepository: CategoryRepository,
    private val shopService: ShopService
) {

    // pending 상태 가게 목록 조회
    fun getPendingShops(): List<ShopResponse> {
        val allCategories = categoryRepository.findAll()
        return shopRepository.findByStatus("pending")
            .map { shopService.toResponse(it, allCategories) }
    }

    // 가게 상태 변경 (approved | rejected)
    fun updateShopStatus(id: String, status: String): ShopResponse {
        val shop = shopRepository.findById(id)
            .orElseThrow { NoSuchElementException("가게를 찾을 수 없습니다. id=$id") }
        val updated = shop.copy(status = status)
        val saved = shopRepository.save(updated)
        val allCategories = categoryRepository.findAll()
        return shopService.toResponse(saved, allCategories)
    }

    // 가게 정보 수정 (status 유지)
    fun updateShop(id: String, request: ShopRequest): ShopResponse {
        val existing = shopRepository.findById(id)
            .orElseThrow { NoSuchElementException("가게를 찾을 수 없습니다. id=$id") }
        val updated = existing.copy(
            name = request.name,
            address = request.address,
            location = request.location,
            categoryIds = request.categoryIds,
            phone = request.phone,
            businessHours = request.businessHours,
            menu = request.menu
        )
        val saved = shopRepository.save(updated)
        val allCategories = categoryRepository.findAll()
        return shopService.toResponse(saved, allCategories)
    }

    // 가게 삭제
    fun deleteShop(id: String) {
        if (!shopRepository.existsById(id)) {
            throw NoSuchElementException("가게를 찾을 수 없습니다. id=$id")
        }
        shopRepository.deleteById(id)
    }
}
