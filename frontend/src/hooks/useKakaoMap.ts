import { useEffect, useRef, useState } from 'react'

interface MapCenter {
  lat: number
  lng: number
}

// 카카오맵 SDK를 초기화하고 지도 인스턴스를 반환하는 훅
function useKakaoMap(center: MapCenter, level: number) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)

  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainerRef.current) return

      window.kakao.maps.load(() => {
        if (!mapContainerRef.current) return
        const options = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level,
        }
        const mapInstance = new window.kakao.maps.Map(mapContainerRef.current, options)
        setMap(mapInstance)
      })
    }

    // SDK가 이미 로드된 경우 바로 초기화
    if (window.kakao) {
      initializeMap()
      return
    }

    // SDK 스크립트가 아직 로드 중이면 load 이벤트 이후 초기화
    const script = document.querySelector('script[src*="dapi.kakao.com"]') as HTMLScriptElement | null
    if (script) {
      script.addEventListener('load', initializeMap)
      return () => script.removeEventListener('load', initializeMap)
    }
  }, [])

  return { mapContainerRef, map }
}

export default useKakaoMap
