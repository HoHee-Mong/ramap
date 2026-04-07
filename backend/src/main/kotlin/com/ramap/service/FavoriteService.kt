package com.ramap.service

import com.ramap.dto.ShopResponse
import com.ramap.repository.ShopRepository
import com.ramap.repository.UserRepository
import org.springframework.stereotype.Service

// 즐겨찾기 비즈니스 로직
@Service
class FavoriteService(
    private val userRepository: UserRepository,
    private val shopRepository: ShopRepository
) {

    // 즐겨찾기 추가: 가게 존재 확인 후 목록에 없을 때만 추가
    fun addFavorite(email: String, shopId: String) {
        shopRepository.findById(shopId).orElseThrow { NoSuchElementException("가게를 찾을 수 없습니다") }
        val user = userRepository.findByEmail(email) ?: throw IllegalArgumentException("유저를 찾을 수 없습니다")
        if (!user.favoriteShopIds.contains(shopId)) {
            userRepository.save(user.copy(favoriteShopIds = user.favoriteShopIds + shopId))
        }
    }

    // 즐겨찾기 제거
    fun removeFavorite(email: String, shopId: String) {
        val user = userRepository.findByEmail(email) ?: throw IllegalArgumentException("유저를 찾을 수 없습니다")
        userRepository.save(user.copy(favoriteShopIds = user.favoriteShopIds - shopId))
    }

    // 즐겨찾기한 가게 목록 조회 (삭제된 가게는 자동 제외)
    fun getFavoriteShops(email: String): List<ShopResponse> {
        val user = userRepository.findByEmail(email) ?: throw IllegalArgumentException("유저를 찾을 수 없습니다")
        return user.favoriteShopIds.mapNotNull { shopId ->
            shopRepository.findById(shopId).orElse(null)?.let { ShopResponse.from(it) }
        }
    }

    // 특정 가게 즐겨찾기 여부 확인
    fun isFavorite(email: String, shopId: String): Boolean {
        val user = userRepository.findByEmail(email) ?: return false
        return user.favoriteShopIds.contains(shopId)
    }
}
