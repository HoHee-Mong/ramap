package com.ramap.controller

import com.ramap.dto.ApiResponse
import com.ramap.dto.ReviewRequest
import com.ramap.service.ReviewService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

// 리뷰 API 엔드포인트
@RestController
@RequestMapping("/api/v1/ramen-shops/{shopId}/reviews")
class ReviewController(private val reviewService: ReviewService) {

    // 특정 가게 리뷰 목록 조회
    @GetMapping
    fun getReviews(@PathVariable shopId: String): ApiResponse<*> {
        return ApiResponse.ok(reviewService.getReviews(shopId))
    }

    // 리뷰 작성
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createReview(
        @PathVariable shopId: String,
        @Valid @RequestBody request: ReviewRequest
    ): ApiResponse<*> {
        return ApiResponse.ok(reviewService.createReview(shopId, request))
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteReview(
        @PathVariable shopId: String,
        @PathVariable reviewId: String
    ) {
        reviewService.deleteReview(shopId, reviewId)
    }
}
