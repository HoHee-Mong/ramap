package com.ramap.repository

import com.ramap.model.Review
import org.springframework.data.mongodb.repository.MongoRepository

// 리뷰 MongoDB 레포지토리
interface ReviewRepository : MongoRepository<Review, String> {

    // 특정 가게의 리뷰 목록 조회
    fun findByShopId(shopId: String): List<Review>

    // 특정 가게의 리뷰 수 조회 (평균 별점 재계산용)
    fun countByShopId(shopId: String): Long
}
