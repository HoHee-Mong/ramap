import { useEffect, useState } from 'react'
import { fetchShop } from '../api/shopApi'
import type { Shop } from '../types/shop'

// 단건 가게 정보를 API에서 불러오는 훅
function useShop(id: string) {
  const [shop, setShop] = useState<Shop | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchShop(id)
      .then(setShop)
      .catch(() => setError('가게 정보를 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false))
  }, [id])

  return { shop, isLoading, error }
}

export default useShop
