import type { Shop } from '../types/shop'

// 지도 핀 표시 테스트용 임시 데이터
export const TEST_SHOPS: Shop[] = [
  {
    id: '1',
    name: '멘야 무사시',
    address: '서울 마포구 홍익로 5길 20',
    location: { lat: 37.5563, lng: 126.9238 },
    ramenTypes: ['쇼유', '미소'],
    menu: [],
    reviewCount: 0,
    averageRating: 0,
  },
  {
    id: '2',
    name: '이치란 라멘',
    address: '서울 용산구 이태원로 177',
    location: { lat: 37.5340, lng: 126.9946 },
    ramenTypes: ['돈코츠'],
    menu: [],
    reviewCount: 0,
    averageRating: 0,
  },
  {
    id: '3',
    name: '후쿠오카 라멘',
    address: '서울 강남구 테헤란로 152',
    location: { lat: 37.4979, lng: 127.0276 },
    ramenTypes: ['돈코츠', '츠케멘'],
    menu: [],
    reviewCount: 0,
    averageRating: 0,
  },
]
