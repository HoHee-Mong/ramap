import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useKakaoMap from '../../hooks/useKakaoMap'
import type { Shop } from '../../types/shop'

interface Props {
  shops: Shop[]
}

// 서울/경기권 중심 좌표 기본값
const SEOUL_CENTER = { lat: 37.5165, lng: 127.0050 }
const DEFAULT_ZOOM_LEVEL = 8

// 커스텀 틸 핀 마커 SVG (data URL)
const MARKER_SVG = encodeURIComponent(
  '<svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="#2BA8A0"/>' +
  '<circle cx="14" cy="14" r="6" fill="#FFFFFF"/>' +
  '<circle cx="14" cy="14" r="3" fill="#2BA8A0"/>' +
  '</svg>'
)
const MARKER_IMAGE_SRC = `data:image/svg+xml;charset=utf-8,${MARKER_SVG}`

// 카카오맵과 가게 마커를 렌더링하는 컴포넌트
function MapView({ shops }: Props) {
  const { mapContainerRef, map } = useKakaoMap(SEOUL_CENTER, DEFAULT_ZOOM_LEVEL)
  const navigate = useNavigate()

  useEffect(() => {
    if (!map) return

    const markerSize = new window.kakao.maps.Size(28, 36)
    const markerImageOption = { offset: new window.kakao.maps.Point(14, 36) }
    const markerImage = new window.kakao.maps.MarkerImage(MARKER_IMAGE_SRC, markerSize, markerImageOption)

    const markers: any[] = shops.map((shop) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(shop.location.lat, shop.location.lng),
        map,
        image: markerImage,
      })

      // 마커 클릭 시 상세 페이지로 이동
      window.kakao.maps.event.addListener(marker, 'click', () => {
        navigate(`/shops/${shop.id}`)
      })

      return marker
    })

    return () => {
      markers.forEach((marker) => marker.setMap(null))
    }
  }, [map, shops])

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
}

export default MapView
