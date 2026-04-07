import { useEffect, useState } from 'react'
import { fetchCategories } from '../api/categoryApi'
import type { Category } from '../types/category'

// 카테고리 목록을 API에서 불러오는 훅
function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  return { categories, isLoading }
}

export default useCategories
