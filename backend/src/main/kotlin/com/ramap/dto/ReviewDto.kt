package com.ramap.dto

import com.ramap.model.Review
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import java.time.LocalDateTime

// 리뷰 작성 요청 DTO
data class ReviewRequest(
    @field:NotBlank(message = "닉네임을 입력해주세요.")
    val authorNickname: String,

    @field:Min(value = 1, message = "별점은 최소 1점입니다.")
    @field:Max(value = 5, message = "별점은 최대 5점입니다.")
    val rating: Int,

    @field:NotBlank(message = "리뷰 내용을 입력해주세요.")
    val content: String
)

// 리뷰 응답 DTO
data class ReviewResponse(
    val id: String,
    val shopId: String,
    val authorNickname: String,
    val rating: Int,
    val content: String,
    val createdAt: LocalDateTime
) {
    companion object {
        // Review 도큐먼트를 응답 DTO로 변환
        fun from(review: Review) = ReviewResponse(
            id = review.id!!,
            shopId = review.shopId,
            authorNickname = review.authorNickname,
            rating = review.rating,
            content = review.content,
            createdAt = review.createdAt
        )
    }
}
