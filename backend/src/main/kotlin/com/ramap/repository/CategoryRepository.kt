package com.ramap.repository

import com.ramap.model.Category
import org.springframework.data.mongodb.repository.MongoRepository

// 카테고리 MongoDB 레포지토리
interface CategoryRepository : MongoRepository<Category, String> {

    // 이름으로 카테고리 존재 여부 확인
    fun existsByName(name: String): Boolean

    // 이름으로 카테고리 조회
    fun findByName(name: String): Category?
}
