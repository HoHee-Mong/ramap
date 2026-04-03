// 리뷰 타입 정의
export interface Review {
  id: string
  shopId: string
  authorNickname: string
  rating: number
  content: string
  createdAt: string
}

// 리뷰 작성 요청 타입
export interface ReviewRequest {
  authorNickname: string
  rating: number
  content: string
}
