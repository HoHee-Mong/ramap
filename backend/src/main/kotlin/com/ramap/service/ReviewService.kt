package com.ramap.service

import com.ramap.dto.ReviewRequest
import com.ramap.dto.ReviewResponse
import com.ramap.model.Review
import com.ramap.repository.ReviewRepository
import com.ramap.repository.ShopRepository
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import org.springframework.stereotype.Service

// 리뷰 비즈니스 로직
@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val shopRepository: ShopRepository,
    private val mongoTemplate: MongoTemplate
) {

    // 특정 가게의 리뷰 목록 조회
    fun getReviews(shopId: String): List<ReviewResponse> {
        return reviewRepository.findByShopId(shopId).map { ReviewResponse.from(it) }
    }

    // 리뷰 작성 후 가게 평균 별점/리뷰 수 업데이트
    fun createReview(shopId: String, request: ReviewRequest): ReviewResponse {
        shopRepository.findById(shopId)
            .orElseThrow { NoSuchElementException("가게를 찾을 수 없습니다. id=$shopId") }

        val review = reviewRepository.save(
            Review(shopId = shopId, authorNickname = request.authorNickname, rating = request.rating, content = request.content)
        )

        updateShopRating(shopId)
        return ReviewResponse.from(review)
    }

    // 리뷰 삭제 후 가게 평균 별점/리뷰 수 업데이트
    fun deleteReview(shopId: String, reviewId: String) {
        val review = reviewRepository.findById(reviewId)
            .orElseThrow { NoSuchElementException("리뷰를 찾을 수 없습니다. id=$reviewId") }
        if (review.shopId != shopId) throw IllegalArgumentException("해당 가게의 리뷰가 아닙니다.")

        reviewRepository.deleteById(reviewId)
        updateShopRating(shopId)
    }

    // 가게의 평균 별점과 리뷰 수를 현재 리뷰 기준으로 재계산
    private fun updateShopRating(shopId: String) {
        val reviews = reviewRepository.findByShopId(shopId)
        val averageRating = if (reviews.isEmpty()) 0.0 else reviews.map { it.rating }.average()

        mongoTemplate.updateFirst(
            Query(Criteria.where("_id").`is`(shopId)),
            Update().set("averageRating", averageRating).set("reviewCount", reviews.size),
            "shops"
        )
    }
}
