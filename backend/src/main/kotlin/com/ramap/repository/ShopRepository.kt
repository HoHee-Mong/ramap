package com.ramap.repository

import com.ramap.model.Shop
import org.springframework.data.mongodb.repository.MongoRepository

// 가게 MongoDB 레포지토리
interface ShopRepository : MongoRepository<Shop, String> {

    // 라멘 종류 배열에 해당 값이 포함된 가게 목록 조회
    fun findByRamenTypesContaining(ramenType: String): List<Shop>
}
