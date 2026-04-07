import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useShops from '../hooks/useShops'
import useCategories from '../hooks/useCategories'
import { SearchIcon, HeartIcon, StarIcon, XIcon } from '../components/common/Icons'
import type { Shop } from '../types/shop'

// 검색 페이지 - 가게 목록 + 텍스트 검색(서버사이드) + 카테고리 필터
function SearchPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { shops, isLoading } = useShops(selectedCategoryId, debouncedQuery)
  const { categories } = useCategories()
  const navigate = useNavigate()

  // 검색어 디바운싱 (500ms 후 서버 요청)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div style={pageStyle}>
      {/* 검색 바 */}
      <div style={searchBarWrapperStyle}>
        <div style={searchBarStyle}>
          <SearchIcon size={20} color="#AAAAAA" />
          <input
            type="text"
            placeholder="가게명, 지역 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={inputStyle}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} style={clearButtonStyle}>
              <XIcon size={16} color="#AAAAAA" />
            </button>
          )}
        </div>
      </div>

      {/* 카테고리 칩 필터 */}
      <div style={filterWrapperStyle} className="no-scrollbar">
        <button
          onClick={() => setSelectedCategoryId(null)}
          style={chipStyle(selectedCategoryId === null)}
        >
          전체
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id)}
            style={chipStyle(selectedCategoryId === cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 결과 수 */}
      <p style={resultCountStyle}>
        검색 결과 <span style={{ color: '#2BA8A0', fontWeight: 700 }}>{shops.length}</span>
      </p>

      {/* 가게 목록 */}
      <div style={listStyle}>
        {isLoading ? (
          <p style={emptyStyle}>불러오는 중...</p>
        ) : shops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <span style={{ fontSize: '40px' }}>🍜</span>
            <p style={{ ...emptyStyle, marginTop: '12px' }}>검색 결과가 없습니다.</p>
          </div>
        ) : (
          shops.map(shop => (
            <ShopCard key={shop.id} shop={shop} onClick={() => navigate(`/shops/${shop.id}`)} />
          ))
        )}
      </div>
    </div>
  )
}

// 검색 결과 가게 카드
function ShopCard({ shop, onClick }: { shop: Shop; onClick: () => void }) {
  const primaryCategory = shop.categories[0]

  return (
    <div onClick={onClick} style={cardStyle}>
      {/* 이미지 / 플레이스홀더 */}
      {shop.imageUrl ? (
        <img src={shop.imageUrl} alt={shop.name} style={imageStyle} />
      ) : (
        <div style={imagePlaceholderStyle}>
          <span style={{ fontSize: '28px' }}>🍜</span>
        </div>
      )}

      <div style={{ flex: 1, padding: '4px 0' }}>
        {/* 카테고리 태그 + 즐겨찾기 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          {primaryCategory && (
            <span style={tagStyle}>{primaryCategory.name}</span>
          )}
          <HeartIcon size={18} color="#E0E0E0" />
        </div>

        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A', marginBottom: '4px' }}>
          {shop.name}
        </h3>

        {shop.reviewCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <StarIcon size={14} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>
              {shop.averageRating.toFixed(1)}
            </span>
            <span style={{ fontSize: '13px', color: '#AAAAAA' }}>({shop.reviewCount})</span>
          </div>
        )}

        <p style={{ fontSize: '12px', color: '#AAAAAA', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {shop.address}
        </p>
      </div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflowY: 'auto',
  backgroundColor: '#F2EFE9',
  display: 'flex',
  flexDirection: 'column',
}

const searchBarWrapperStyle: React.CSSProperties = {
  padding: '48px 16px 12px',
  backgroundColor: '#FFFFFF',
}

const searchBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: '#F9F9F9',
  border: '1px solid #E0E0E0',
  borderRadius: '16px',
  padding: '10px 14px',
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  backgroundColor: 'transparent',
  fontSize: '15px',
  color: '#1A1A1A',
}

const clearButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '2px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
}

const filterWrapperStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  padding: '12px 16px',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #F0F0F0',
}

function chipStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: '100px',
    border: isActive ? 'none' : '1px solid #E0E0E0',
    backgroundColor: isActive ? '#2BA8A0' : '#FFFFFF',
    color: isActive ? '#FFFFFF' : '#666666',
    fontSize: '13px',
    fontWeight: isActive ? 700 : 400,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.15s',
  }
}

const resultCountStyle: React.CSSProperties = {
  padding: '16px 16px 8px',
  fontSize: '15px',
  fontWeight: 700,
  color: '#1A1A1A',
}

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '0 16px 24px',
}

const cardStyle: React.CSSProperties = {
  display: 'flex',
  gap: '14px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '14px',
  cursor: 'pointer',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}

const imageStyle: React.CSSProperties = {
  width: '88px',
  height: '88px',
  borderRadius: '12px',
  objectFit: 'cover',
  flexShrink: 0,
}

const imagePlaceholderStyle: React.CSSProperties = {
  width: '88px',
  height: '88px',
  borderRadius: '12px',
  backgroundColor: '#E8F7F6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const tagStyle: React.CSSProperties = {
  padding: '3px 10px',
  backgroundColor: '#E8F7F6',
  borderRadius: '100px',
  fontSize: '11px',
  fontWeight: 700,
  color: '#2BA8A0',
}

const emptyStyle: React.CSSProperties = {
  color: '#AAAAAA',
  fontSize: '14px',
  textAlign: 'center',
}

export default SearchPage
