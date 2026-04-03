// 가게 등록 요청 타입
export interface ShopRequest {
  name: string
  address: string
  location: { lat: number; lng: number }
  ramenTypes: string[]
  phone: string
  businessHours: string
}

// 메뉴 항목 타입
export interface MenuItem {
  name: string
  price: number
}

// 가게 타입 정의
export interface Shop {
  id: string
  name: string
  address: string
  location: {
    lat: number
    lng: number
  }
  ramenTypes: string[]
  phone?: string
  businessHours?: string
  menu: MenuItem[]
}
