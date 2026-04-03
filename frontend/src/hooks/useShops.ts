import { useEffect, useState } from 'react'
import { fetchShops } from '../api/shopApi'
import type { Shop } from '../types/shop'

// 가게 목록을 API에서 불러오는 훅 (ramenType 변경 시 재요청)
function useShops(ramenType: string | null) {
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    fetchShops(ramenType ?? undefined)
      .then(setShops)
      .catch(() => setError('가게 목록을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false))
  }, [ramenType])

  return { shops, isLoading, error }
}

export default useShops
