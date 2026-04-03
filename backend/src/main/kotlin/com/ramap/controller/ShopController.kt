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

    // 전체 또는 라멘 종류별 가게 목록 조회
    @GetMapping
    fun getAllShops(@RequestParam(required = false) ramenType: String?): ApiResponse<*> {
        return ApiResponse.ok(shopService.getShops(ramenType))
    }

    // 단건 가게 조회
    @GetMapping("/{id}")
    fun getShop(@PathVariable id: String): ApiResponse<*> {
        return ApiResponse.ok(shopService.getShopById(id))
    }

    // 가게 등록
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createShop(@RequestBody request: ShopRequest): ApiResponse<*> {
        return ApiResponse.ok(shopService.createShop(request))
    }
}
