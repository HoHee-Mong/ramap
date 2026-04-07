package com.ramap.controller

import com.ramap.dto.ApiResponse
import com.ramap.dto.ShopRequest
import com.ramap.service.ShopService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

// 가게 API 엔드포인트
@RestController
@RequestMapping("/api/v1/ramen-shops")
class ShopController(private val shopService: ShopService) {

    // approved 가게 목록 조회 (카테고리/텍스트 검색 지원)
    @GetMapping
    fun getAllShops(
        @RequestParam(required = false) categoryId: String?,
        @RequestParam(required = false) q: String?
    ): ApiResponse<*> {
        return ApiResponse.ok(shopService.getShops(categoryId, q))
    }

    // 위치 기반 주변 가게 조회
    @GetMapping("/nearby")
    fun getNearbyShops(
        @RequestParam lat: Double,
        @RequestParam lng: Double,
        @RequestParam(defaultValue = "3.0") radius: Double
    ): ApiResponse<*> {
        return ApiResponse.ok(shopService.getNearbyShops(lat, lng, radius))
    }

    // 단건 가게 조회
    @GetMapping("/{id}")
    fun getShop(@PathVariable id: String): ApiResponse<*> {
        return ApiResponse.ok(shopService.getShopById(id))
    }

    // 가게 등록 (로그인 필요, status = pending으로 저장)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createShop(@RequestBody request: ShopRequest): ApiResponse<*> {
        return ApiResponse.ok(shopService.createShop(request))
    }
}
