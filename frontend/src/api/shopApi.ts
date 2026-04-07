import type { Shop, ShopRequest } from '../types/shop'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// 전체 또는 카테고리별 / 텍스트 검색 가게 목록 조회 (approved만)
export async function fetchShops(categoryId?: string, q?: string): Promise<Shop[]> {
  const params = new URLSearchParams()
  if (categoryId) params.set('categoryId', categoryId)
  if (q) params.set('q', q)
  const query = params.toString()
  const url = `${BASE_URL}/api/v1/ramen-shops${query ? '?' + query : ''}`
  const response = await fetch(url)
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}

// 위치 기반 주변 가게 조회 (기본 반경 3km)
export async function fetchNearbyShops(lat: number, lng: number, radius = 3.0): Promise<Shop[]> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    radius: radius.toString(),
  })
  const response = await fetch(`${BASE_URL}/api/v1/ramen-shops/nearby?${params}`)
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}

// 단건 가게 조회
export async function fetchShop(id: string): Promise<Shop> {
  const response = await fetch(`${BASE_URL}/api/v1/ramen-shops/${id}`)
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}

// 가게 등록 (로그인 필요, status = pending으로 저장)
export async function createShop(request: ShopRequest, token: string): Promise<Shop> {
  const response = await fetch(`${BASE_URL}/api/v1/ramen-shops`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}
