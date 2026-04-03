import type { Review, ReviewRequest } from '../types/review'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// 특정 가게의 리뷰 목록 조회
export async function fetchReviews(shopId: string): Promise<Review[]> {
  const response = await fetch(`${BASE_URL}/api/v1/ramen-shops/${shopId}/reviews`)
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}

// 리뷰 작성 (로그인 필요)
export async function createReview(shopId: string, request: ReviewRequest, token: string): Promise<Review> {
  const response = await fetch(`${BASE_URL}/api/v1/ramen-shops/${shopId}/reviews`, {
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

// 리뷰 삭제
export async function deleteReview(shopId: string, reviewId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/v1/ramen-shops/${shopId}/reviews/${reviewId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('리뷰 삭제에 실패했습니다.')
}
