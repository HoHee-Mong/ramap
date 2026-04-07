import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { fetchFavorites, removeFavorite } from '../api/favoriteApi'
import type { Shop } from '../types/shop'

// 마이페이지: 즐겨찾기한 가게 목록 표시
function MyPage() {
  const { user, token } = useAuthContext()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 즐겨찾기 목록 로드
  useEffect(() => {
    if (!token) return
    fetchFavorites(token)
      .then(setFavorites)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [token])

  // 즐겨찾기 제거 후 목록 갱신
  async function handleRemove(shopId: string) {
    if (!token) return
    await removeFavorite(shopId, token)
    setFavorites((previous) => previous.filter((shop) => shop.id !== shopId))
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>{user?.nickname}님의 즐겨찾기</h1>

      {isLoading ? (
        <p style={emptyStyle}>불러오는 중...</p>
      ) : favorites.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={emptyStyle}>즐겨찾기한 가게가 없습니다.</p>
          <Link to="/" style={linkStyle}>지도에서 가게 찾기</Link>
        </div>
      ) : (
        <div style={listStyle}>
          {favorites.map((shop) => (
            <div key={shop.id} style={cardStyle}>
              <div
                style={{ flex: 1, cursor: 'pointer' }}
                onClick={() => navigate(`/shops/${shop.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h2 style={shopNameStyle}>{shop.name}</h2>
                  {shop.reviewCount > 0 && (
                    <span style={ratingStyle}>★ {shop.averageRating.toFixed(1)}</span>
                  )}
                </div>
                <p style={addressStyle}>{shop.address}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {shop.categories.map((category) => (
                    <span key={category.id} style={tagStyle}>{category.name}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleRemove(shop.id)}
                style={removeButtonStyle}
                title="즐겨찾기 해제"
              >
                ♥
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  maxWidth: '520px',
  margin: '0 auto',
  padding: '88px 16px 40px',
}

const titleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#F5F5F5',
  marginBottom: '20px',
}

const emptyStyle: React.CSSProperties = {
  color: '#AAAAAA',
  fontSize: '14px',
  textAlign: 'center',
}

const linkStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '12px',
  color: '#E8001C',
  fontSize: '14px',
  textDecoration: 'none',
}

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  borderRadius: '12px',
  padding: '16px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.3)',
}

const shopNameStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#F5F5F5',
  marginBottom: '4px',
}

const addressStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#AAAAAA',
}

const ratingStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: '#E8001C',
  flexShrink: 0,
}

const tagStyle: React.CSSProperties = {
  padding: '3px 10px',
  backgroundColor: '#2A2A2A',
  borderRadius: '20px',
  fontSize: '11px',
  color: '#AAAAAA',
}

const removeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '20px',
  color: '#E8001C',
  cursor: 'pointer',
  padding: '2px',
  flexShrink: 0,
}

export default MyPage
