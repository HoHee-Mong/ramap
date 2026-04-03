import type { Shop, ShopRequest } from '../types/shop'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// 전체 또는 라멘 종류별 가게 목록 조회
export async function fetchShops(ramenType?: string): Promise<Shop[]> {
  const url = ramenType
    ? `${BASE_URL}/api/v1/ramen-shops?ramenType=${encodeURIComponent(ramenType)}`
    : `${BASE_URL}/api/v1/ramen-shops`
  const response = await fetch(url)
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

// 가게 등록 (로그인 필요)
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
