package com.ramap.controller

import com.ramap.dto.ApiResponse
import com.ramap.dto.ShopRequest
import com.ramap.dto.ShopStatusRequest
import com.ramap.service.AdminService
import org.springframework.web.bind.annotation.*

// 관리자 전용 API 엔드포인트 (ADMIN 권한 필요)
@RestController
@RequestMapping("/api/v1/admin/shops")
class AdminController(private val adminService: AdminService) {

    // pending 가게 목록 조회
    @GetMapping
    fun getPendingShops(): ApiResponse<*> {
        return ApiResponse.ok(adminService.getPendingShops())
    }

    // 가게 상태 변경 (approved | rejected)
    @PatchMapping("/{id}/status")
    fun updateShopStatus(
        @PathVariable id: String,
        @RequestBody body: ShopStatusRequest
    ): ApiResponse<*> {
        return ApiResponse.ok(adminService.updateShopStatus(id, body.status))
    }

    // 가게 정보 수정
    @PutMapping("/{id}")
    fun updateShop(
        @PathVariable id: String,
        @RequestBody request: ShopRequest
    ): ApiResponse<*> {
        return ApiResponse.ok(adminService.updateShop(id, request))
    }

    // 가게 삭제
    @DeleteMapping("/{id}")
    fun deleteShop(@PathVariable id: String): ApiResponse<*> {
        adminService.deleteShop(id)
        return ApiResponse.ok("삭제되었습니다")
    }
}
