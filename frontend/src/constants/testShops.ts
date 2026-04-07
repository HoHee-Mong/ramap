import type { Shop } from '../types/shop'

// 지도 핀 표시 테스트용 임시 데이터
export const TEST_SHOPS: Shop[] = [
  {
    id: '1',
    name: '멘야 무사시',
    address: '서울 마포구 홍익로 5길 20',
    location: { lat: 37.5563, lng: 126.9238 },
    categories: [],
    menu: [],
    reviewCount: 0,
    averageRating: 0,
  },
  {
    id: '2',
    name: '이치란 라멘',
    address: '서울 용산구 이태원로 177',
    location: { lat: 37.5340, lng: 126.9946 },
    categories: [],
    menu: [],
    reviewCount: 0,
    averageRating: 0,
  },
  {
    id: '3',
    name: '후쿠오카 라멘',
    address: '서울 강남구 테헤란로 152',
    location: { lat: 37.4979, lng: 127.0276 },
    categories: [],
    menu: [],
    reviewCount: 0,
    averageRating: 0,
  },
]
