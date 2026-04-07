import { useState, useEffect } from 'react'
import { addFavorite, removeFavorite, fetchFavoriteStatus } from '../api/favoriteApi'

interface UseFavoriteProps {
  shopId: string
  token: string | null
}

// 특정 가게의 즐겨찾기 상태 및 토글 기능 커스텀 훅
export function useFavorite({ shopId, token }: UseFavoriteProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 마운트 시 현재 즐겨찾기 상태 조회
  useEffect(() => {
    if (!token) return
    fetchFavoriteStatus(shopId, token)
      .then(setIsFavorite)
      .catch(() => {})
  }, [shopId, token])

  // 즐겨찾기 토글 (낙관적 업데이트)
  async function toggleFavorite() {
    if (!token || isLoading) return
    const nextState = !isFavorite
    setIsFavorite(nextState)
    setIsLoading(true)
    try {
      if (nextState) {
        await addFavorite(shopId, token)
      } else {
        await removeFavorite(shopId, token)
      }
    } catch {
      // 실패 시 원래 상태로 복원
      setIsFavorite(!nextState)
    } finally {
      setIsLoading(false)
    }
  }

  return { isFavorite, isLoading, toggleFavorite }
}
