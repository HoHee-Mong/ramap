import { useState } from 'react'
import MapView from '../components/map/MapView'
import RamenTypeFilter from '../components/map/RamenTypeFilter'
import useShops from '../hooks/useShops'

// 홈 페이지 - 지도 메인 화면
function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { shops, isLoading, error } = useShops(selectedCategoryId)

  return (
    <main style={{ paddingTop: 'var(--nav-height)', position: 'relative' }}>
      {/* 카테고리 필터 */}
      <div style={filterBarStyle}>
        <RamenTypeFilter selectedCategoryId={selectedCategoryId} onSelect={setSelectedCategoryId} />
      </div>

      {error && (
        <div style={errorStyle}>{error}</div>
      )}

      {!isLoading && <MapView shops={shops} />}
    </main>
  )
}

const filterBarStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(var(--nav-height) + 14px)',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
  backgroundColor: '#1A1A1A',
  padding: '10px 14px',
  borderRadius: 'var(--radius-pill)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  whiteSpace: 'nowrap',
}

const errorStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(var(--nav-height) + 80px)',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
  color: '#E8001C',
  fontSize: '14px',
  backgroundColor: '#fff',
  padding: '8px 16px',
  borderRadius: 'var(--radius-md)',
}

export default HomePage
