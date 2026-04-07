import type { Shop, ShopRequest } from '../types/shop'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// pending 가게 목록 조회
export async function fetchPendingShops(token: string): Promise<Shop[]> {
  const response = await fetch(`${BASE_URL}/api/v1/admin/shops`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}

// 가게 상태 변경 (approved | rejected)
export async function updateShopStatus(shopId: string, status: string, token: string): Promise<Shop> {
  const response = await fetch(`${BASE_URL}/api/v1/admin/shops/${shopId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}

// 가게 정보 수정
export async function adminUpdateShop(shopId: string, request: ShopRequest, token: string): Promise<Shop> {
  const response = await fetch(`${BASE_URL}/api/v1/admin/shops/${shopId}`, {
    method: 'PUT',
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

// 가게 삭제
export async function adminDeleteShop(shopId: string, token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/v1/admin/shops/${shopId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
}
