import type { Category } from '../types/category'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// 전체 카테고리 목록 조회
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/api/v1/categories`)
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}
