import { useCallback, useEffect, useState } from 'react'
import { fetchReviews } from '../api/reviewApi'
import type { Review } from '../types/review'

// 특정 가게의 리뷰 목록을 불러오는 훅
function useReviews(shopId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReviews = useCallback(() => {
    setIsLoading(true)
    fetchReviews(shopId)
      .then(setReviews)
      .catch(() => setError('리뷰를 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false))
  }, [shopId])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  return { reviews, isLoading, error, refetch: loadReviews }
}

export default useReviews
