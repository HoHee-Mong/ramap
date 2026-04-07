import { useState } from 'react'
import { Link } from 'react-router-dom'
import MapView from '../components/map/MapView'
import useShops from '../hooks/useShops'
import useCategories from '../hooks/useCategories'
import { SearchIcon, SlidersIcon, XIcon } from '../components/common/Icons'

// 홈 페이지 - 카카오맵 + 카테고리 필터
function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const { shops, isLoading, error } = useShops(selectedCategoryId)
  const { categories } = useCategories()

  const selectedCategory = categories.find(c => c.id === selectedCategoryId)

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* 지도 */}
      {!isLoading && <MapView shops={shops} />}

      {/* 플로팅 헤더 */}
      <header style={headerStyle}>
        <h1 style={logoStyle}>RAMAP <span style={{ fontSize: '20px' }}>🍜</span></h1>
        <Link to="/search" style={searchButtonStyle}>
          <SearchIcon size={20} color="#374151" />
        </Link>
      </header>

      {/* 카테고리 필터 바 */}
      <div style={filterBarStyle}>
        <div style={filterScrollStyle} className="no-scrollbar">
          <button onClick={() => setIsCategoryModalOpen(true)} style={categoryTriggerStyle}>
            <SlidersIcon size={14} color="#6B7280" />
            <span>카테고리</span>
          </button>
          {selectedCategory && (
            <button onClick={() => setSelectedCategoryId(null)} style={selectedChipStyle}>
              {selectedCategory.name}
              <span style={{ marginLeft: '4px', display: 'inline-flex', alignItems: 'center' }}>
                <XIcon size={13} color="#FFFFFF" />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && <div style={errorStyle}>{error}</div>}

      {/* 카테고리 모달 백드롭 */}
      {isCategoryModalOpen && (
        <div style={backdropStyle} onClick={() => setIsCategoryModalOpen(false)} />
      )}

      {/* 카테고리 바텀 시트 */}
      <div style={sheetStyle(isCategoryModalOpen)}>
        <div style={{ padding: '8px 24px 32px' }}>
          {/* 드래그 핸들 */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '16px' }}>
            <div style={{ width: '40px', height: '4px', backgroundColor: '#E0E0E0', borderRadius: '2px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A1A' }}>어떤 라멘을 찾으시나요?</h3>
            <button onClick={() => setIsCategoryModalOpen(false)} style={closeButtonStyle}>
              <XIcon size={18} color="#374151" />
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            <button
              onClick={() => { setSelectedCategoryId(null); setIsCategoryModalOpen(false) }}
              style={catChipStyle(selectedCategoryId === null)}
            >
              전체
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategoryId(cat.id); setIsCategoryModalOpen(false) }}
                style={catChipStyle(selectedCategoryId === cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <button onClick={() => setIsCategoryModalOpen(false)} style={applyButtonStyle}>
            {selectedCategory ? `${selectedCategory.name} 보기` : '전체 보기'}
          </button>
        </div>
      </div>
    </div>
  )
}

const headerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  padding: '48px 16px 16px',
  background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  pointerEvents: 'none',
}

const logoStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 900,
  color: '#2BA8A0',
  letterSpacing: '-0.5px',
  pointerEvents: 'auto',
}

const searchButtonStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  pointerEvents: 'auto',
  textDecoration: 'none',
}

const filterBarStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100px',
  left: 0,
  right: 0,
  zIndex: 10,
  padding: '0 16px',
}

const filterScrollStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  paddingBottom: '4px',
}

const categoryTriggerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  backgroundColor: 'rgba(255,255,255,0.95)',
  border: '1px solid #E0E0E0',
  borderRadius: '100px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}

const selectedChipStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 10px 8px 14px',
  backgroundColor: '#1A1A1A',
  border: 'none',
  borderRadius: '100px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#FFFFFF',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
}

const errorStyle: React.CSSProperties = {
  position: 'absolute',
  top: '150px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
  color: '#DC2626',
  fontSize: '13px',
  backgroundColor: '#FFFFFF',
  padding: '8px 16px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}

const backdropStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  zIndex: 30,
}

function sheetStyle(isOpen: boolean): React.CSSProperties {
  return {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: '24px 24px 0 0',
    boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
    zIndex: 40,
    transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.3s ease',
  }
}

const closeButtonStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  backgroundColor: '#F0F0F0',
  border: 'none',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

function catChipStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: '10px 18px',
    borderRadius: '12px',
    border: isActive ? 'none' : '1.5px solid #E0E0E0',
    backgroundColor: isActive ? '#E8F7F6' : '#FFFFFF',
    color: isActive ? '#2BA8A0' : '#666666',
    fontSize: '14px',
    fontWeight: isActive ? 700 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s',
    boxShadow: isActive ? '0 0 0 1.5px #2BA8A0' : 'none',
  }
}

const applyButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '15px',
  backgroundColor: '#1A1A1A',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
}

export default HomePage
