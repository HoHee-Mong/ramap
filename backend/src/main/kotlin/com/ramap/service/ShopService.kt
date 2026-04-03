package com.ramap.service

import com.ramap.dto.ShopRequest
import com.ramap.dto.ShopResponse
import com.ramap.repository.ShopRepository
import org.springframework.stereotype.Service

// 가게 비즈니스 로직
@Service
class ShopService(private val shopRepository: ShopRepository) {

    // 전체 또는 라멘 종류별 가게 목록 조회
    fun getShops(ramenType: String?): List<ShopResponse> {
        val shops = if (ramenType != null) {
            shopRepository.findByRamenTypesContaining(ramenType)
        } else {
            shopRepository.findAll()
        }
        return shops.map { ShopResponse.from(it) }
    }

    // 단건 가게 조회
    fun getShopById(id: String): ShopResponse {
        val shop = shopRepository.findById(id)
            .orElseThrow { NoSuchElementException("가게를 찾을 수 없습니다. id=$id") }
        return ShopResponse.from(shop)
    }

    // 가게 등록
    fun createShop(request: ShopRequest): ShopResponse {
        val saved = shopRepository.save(request.toShop())
        return ShopResponse.from(saved)
    }
}
