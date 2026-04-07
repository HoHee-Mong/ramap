package com.ramap.repository

import com.ramap.model.Shop
import org.springframework.data.mongodb.repository.MongoRepository

// 가게 MongoDB 레포지토리
interface ShopRepository : MongoRepository<Shop, String> {

    // 카테고리 ID 배열에 해당 값이 포함된 가게 목록 조회
    fun findByCategoryIdsContaining(categoryId: String): List<Shop>

    // 상태별 가게 목록 조회
    fun findByStatus(status: String): List<Shop>

    // 상태 + 카테고리 복합 조회
    fun findByCategoryIdsContainingAndStatus(categoryId: String, status: String): List<Shop>

    // 이름 또는 주소로 가게 검색 (대소문자 무시)
    fun findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
        name: String,
        address: String
    ): List<Shop>
}
