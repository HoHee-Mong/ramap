package com.ramap.repository

import com.ramap.model.User
import org.springframework.data.mongodb.repository.MongoRepository

// 유저 MongoDB 쿼리 인터페이스
interface UserRepository : MongoRepository<User, String> {
    // 이메일로 유저 조회
    fun findByEmail(email: String): User?

    // 이메일 중복 여부 확인
    fun existsByEmail(email: String): Boolean
}
