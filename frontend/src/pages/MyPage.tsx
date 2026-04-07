import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { fetchFavorites, removeFavorite } from '../api/favoriteApi'
import type { Shop } from '../types/shop'
import { HeartIcon, UserIcon, LogOutIcon, StarIcon } from '../components/common/Icons'

// 마이페이지: 즐겨찾기한 가게 목록 표시
function MyPage() {
  const { user, token, logout } = useAuthContext()
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
    setFavorites(previous => previous.filter(shop => shop.id !== shopId))
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div style={pageStyle}>
      {/* 유저 프로필 카드 */}
      <div style={profileCardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div style={avatarStyle}>
            <UserIcon size={28} color="#2BA8A0" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>{user?.nickname}</h2>
            <p style={{ fontSize: '13px', color: '#AAAAAA', marginTop: '2px' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={logoutButtonStyle} title="로그아웃">
          <LogOutIcon size={20} color="#AAAAAA" />
        </button>
      </div>

      {/* 찜한 가게 섹션 헤더 */}
      <div style={sectionHeaderStyle}>
        <HeartIcon size={16} color="#EF4444" filled />
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A' }}>
          찜한 라멘 맛집
        </span>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#2BA8A0' }}>
          {favorites.length}
        </span>
      </div>

      {/* 즐겨찾기 목록 */}
      {isLoading ? (
        <p style={emptyStyle}>불러오는 중...</p>
      ) : favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 16px' }}>
          <span style={{ fontSize: '40px' }}>🍜</span>
          <p style={{ ...emptyStyle, marginTop: '12px' }}>아직 찜한 가게가 없습니다.</p>
          <button onClick={() => navigate('/')} style={goMapButtonStyle}>
            지도에서 찾아보기
          </button>
        </div>
      ) : (
        <div style={gridStyle}>
          {favorites.map(shop => (
            <FavoriteCard
              key={shop.id}
              shop={shop}
              onNavigate={() => navigate(`/shops/${shop.id}`)}
              onRemove={() => handleRemove(shop.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 즐겨찾기 카드 컴포넌트
function FavoriteCard({
  shop,
  onNavigate,
  onRemove,
}: {
  shop: Shop
  onNavigate: () => void
  onRemove: () => void
}) {
  const primaryCategory = shop.categories[0]

  return (
    <div style={cardStyle} onClick={onNavigate}>
      {/* 이미지 / 플레이스홀더 */}
      {shop.imageUrl ? (
        <img src={shop.imageUrl} alt={shop.name} style={cardImageStyle} />
      ) : (
        <div style={imagePlaceholderStyle}>
          <span style={{ fontSize: '32px' }}>🍜</span>
        </div>
      )}

      {/* 찜 해제 버튼 */}
      <button
        onClick={e => { e.stopPropagation(); onRemove() }}
        style={heartButtonStyle}
        title="찜 해제"
      >
        <HeartIcon size={16} color="#EF4444" filled />
      </button>

      <div style={{ padding: '10px 12px 12px' }}>
        {primaryCategory && (
          <span style={tagStyle}>{primaryCategory.name}</span>
        )}
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', marginTop: '6px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {shop.name}
        </h3>
        {shop.reviewCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
            <StarIcon size={12} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A' }}>
              {shop.averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflowY: 'auto',
  backgroundColor: '#F2EFE9',
  paddingBottom: '16px',
}

const profileCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '48px 16px 20px',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #F0F0F0',
  marginBottom: '16px',
}

const avatarStyle: React.CSSProperties = {
  width: '52px',
  height: '52px',
  backgroundColor: '#E8F7F6',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const logoutButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '50%',
}

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '0 16px 12px',
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  padding: '0 16px',
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  cursor: 'pointer',
  position: 'relative',
}

const cardImageStyle: React.CSSProperties = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  display: 'block',
}

const imagePlaceholderStyle: React.CSSProperties = {
  width: '100%',
  height: '120px',
  backgroundColor: '#E8F7F6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const heartButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '28px',
  height: '28px',
  backgroundColor: 'rgba(255,255,255,0.85)',
  border: 'none',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

const tagStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '3px 8px',
  backgroundColor: '#E8F7F6',
  borderRadius: '100px',
  fontSize: '10px',
  fontWeight: 700,
  color: '#2BA8A0',
}

const emptyStyle: React.CSSProperties = {
  color: '#AAAAAA',
  fontSize: '14px',
  textAlign: 'center',
}

const goMapButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '16px',
  padding: '10px 20px',
  backgroundColor: '#2BA8A0',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '100px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
}

export default MyPage
