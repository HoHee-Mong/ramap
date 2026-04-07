import type { Shop } from '../types/shop'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// 즐겨찾기 추가
export async function addFavorite(shopId: string, token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/v1/favorites/${shopId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
}

// 즐겨찾기 제거
export async function removeFavorite(shopId: string, token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/v1/favorites/${shopId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
}

// 즐겨찾기 가게 목록 조회
export async function fetchFavorites(token: string): Promise<Shop[]> {
  const response = await fetch(`${BASE_URL}/api/v1/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}

// 특정 가게 즐겨찾기 여부 조회
export async function fetchFavoriteStatus(shopId: string, token: string): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/api/v1/favorites/${shopId}/status`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}
