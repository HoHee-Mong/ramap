package com.ramap.controller

import com.ramap.dto.ApiResponse
import com.ramap.service.FavoriteService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

// 즐겨찾기 API 엔드포인트 (모든 요청 인증 필요)
@RestController
@RequestMapping("/api/v1/favorites")
class FavoriteController(private val favoriteService: FavoriteService) {

    // 즐겨찾기 추가
    @PostMapping("/{shopId}")
    fun addFavorite(
        @PathVariable shopId: String,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ApiResponse<*> {
        favoriteService.addFavorite(userDetails.username, shopId)
        return ApiResponse.success("즐겨찾기에 추가했습니다")
    }

    // 즐겨찾기 제거
    @DeleteMapping("/{shopId}")
    fun removeFavorite(
        @PathVariable shopId: String,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ApiResponse<*> {
        favoriteService.removeFavorite(userDetails.username, shopId)
        return ApiResponse.success("즐겨찾기에서 제거했습니다")
    }

    // 즐겨찾기 가게 목록 조회
    @GetMapping
    fun getFavorites(@AuthenticationPrincipal userDetails: UserDetails): ApiResponse<*> {
        return ApiResponse.ok(favoriteService.getFavoriteShops(userDetails.username))
    }

    // 특정 가게 즐겨찾기 여부 조회
    @GetMapping("/{shopId}/status")
    fun getFavoriteStatus(
        @PathVariable shopId: String,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ApiResponse<*> {
        return ApiResponse.ok(favoriteService.isFavorite(userDetails.username, shopId))
    }
}
