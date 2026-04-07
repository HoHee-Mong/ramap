import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { fetchFavorites, removeFavorite } from '../api/favoriteApi'
import { fetchPendingShops, updateShopStatus, adminDeleteShop } from '../api/adminApi'
import type { Shop } from '../types/shop'
import { HeartIcon, UserIcon, LogOutIcon, StarIcon } from '../components/common/Icons'

type TabType = 'favorites' | 'admin'

// 마이페이지: 즐겨찾기 + 관리자 탭 (ADMIN 유저만 관리자 탭 표시)
function MyPage() {
  const { user, token, logout } = useAuthContext()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('favorites')
  const [favorites, setFavorites] = useState<Shop[]>([])
  const [pendingShops, setPendingShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const isAdmin = user?.role === 'ADMIN'

  // 즐겨찾기 목록 로드
  useEffect(() => {
    if (!token) return
    fetchFavorites(token)
      .then(setFavorites)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [token])

  // 관리자 탭 선택 시 pending 가게 로드
  useEffect(() => {
    if (activeTab !== 'admin' || !token) return
    fetchPendingShops(token)
      .then(setPendingShops)
      .catch(() => {})
  }, [activeTab, token])

  async function handleRemoveFavorite(shopId: string) {
    if (!token) return
    await removeFavorite(shopId, token)
    setFavorites(prev => prev.filter(s => s.id !== shopId))
  }

  async function handleApprove(shopId: string) {
    if (!token) return
    await updateShopStatus(shopId, 'approved', token)
    setPendingShops(prev => prev.filter(s => s.id !== shopId))
  }

  async function handleReject(shopId: string) {
    if (!token) return
    await updateShopStatus(shopId, 'rejected', token)
    setPendingShops(prev => prev.filter(s => s.id !== shopId))
  }

  async function handleDelete(shopId: string) {
    if (!token || !confirm('정말 삭제하시겠습니까?')) return
    await adminDeleteShop(shopId, token)
    setPendingShops(prev => prev.filter(s => s.id !== shopId))
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>{user?.nickname}</h2>
              {isAdmin && <span style={adminBadgeStyle}>ADMIN</span>}
            </div>
            <p style={{ fontSize: '13px', color: '#AAAAAA', marginTop: '2px' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={logoutButtonStyle} title="로그아웃">
          <LogOutIcon size={20} color="#AAAAAA" />
        </button>
      </div>

      {/* 탭 (관리자만 관리자 탭 표시) */}
      <div style={tabBarStyle}>
        <button
          onClick={() => setActiveTab('favorites')}
          style={tabStyle(activeTab === 'favorites')}
        >
          찜한 가게
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            style={tabStyle(activeTab === 'admin')}
          >
            관리자 {pendingShops.length > 0 && <span style={badgeStyle}>{pendingShops.length}</span>}
          </button>
        )}
      </div>

      {/* 찜한 가게 탭 */}
      {activeTab === 'favorites' && (
        <>
          <div style={sectionHeaderStyle}>
            <HeartIcon size={16} color="#EF4444" filled />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A' }}>찜한 라멘 맛집</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#2BA8A0' }}>{favorites.length}</span>
          </div>

          {isLoading ? (
            <p style={emptyStyle}>불러오는 중...</p>
          ) : favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <span style={{ fontSize: '40px' }}>🍜</span>
              <p style={{ ...emptyStyle, marginTop: '12px' }}>아직 찜한 가게가 없습니다.</p>
              <button onClick={() => navigate('/')} style={goMapButtonStyle}>지도에서 찾아보기</button>
            </div>
          ) : (
            <div style={gridStyle}>
              {favorites.map(shop => (
                <FavoriteCard
                  key={shop.id}
                  shop={shop}
                  onNavigate={() => navigate(`/shops/${shop.id}`)}
                  onRemove={() => handleRemoveFavorite(shop.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* 관리자 탭 */}
      {activeTab === 'admin' && isAdmin && (
        <div style={{ padding: '0 16px 24px' }}>
          <p style={{ fontSize: '14px', color: '#666666', marginBottom: '16px' }}>
            승인 대기 중인 가게 <span style={{ color: '#2BA8A0', fontWeight: 700 }}>{pendingShops.length}</span>건
          </p>

          {pendingShops.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <span style={{ fontSize: '40px' }}>✅</span>
              <p style={{ ...emptyStyle, marginTop: '12px' }}>대기 중인 제보가 없습니다.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingShops.map(shop => (
                <AdminShopCard
                  key={shop.id}
                  shop={shop}
                  onApprove={() => handleApprove(shop.id)}
                  onReject={() => handleReject(shop.id)}
                  onDelete={() => handleDelete(shop.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// 즐겨찾기 카드
function FavoriteCard({ shop, onNavigate, onRemove }: { shop: Shop; onNavigate: () => void; onRemove: () => void }) {
  const primaryCategory = shop.categories[0]
  return (
    <div style={cardStyle} onClick={onNavigate}>
      {shop.imageUrl ? (
        <img src={shop.imageUrl} alt={shop.name} style={cardImageStyle} />
      ) : (
        <div style={imagePlaceholderStyle}><span style={{ fontSize: '32px' }}>🍜</span></div>
      )}
      <button onClick={e => { e.stopPropagation(); onRemove() }} style={heartButtonStyle}>
        <HeartIcon size={16} color="#EF4444" filled />
      </button>
      <div style={{ padding: '10px 12px 12px' }}>
        {primaryCategory && <span style={tagStyle}>{primaryCategory.name}</span>}
        <h3 style={cardNameStyle}>{shop.name}</h3>
        {shop.reviewCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
            <StarIcon size={12} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{shop.averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// 관리자용 가게 카드 (승인/거절/삭제)
function AdminShopCard({
  shop,
  onApprove,
  onReject,
  onDelete,
}: { shop: Shop; onApprove: () => void; onReject: () => void; onDelete: () => void }) {
  return (
    <div style={adminCardStyle}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
          {shop.categories.map(c => (
            <span key={c.id} style={tagStyle}>{c.name}</span>
          ))}
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '4px' }}>{shop.name}</h3>
        <p style={{ fontSize: '13px', color: '#666666' }}>{shop.address}</p>
        {shop.phone && <p style={{ fontSize: '12px', color: '#AAAAAA', marginTop: '2px' }}>{shop.phone}</p>}
        {shop.businessHours && <p style={{ fontSize: '12px', color: '#AAAAAA' }}>{shop.businessHours}</p>}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
        <button onClick={onApprove} style={approveButtonStyle}>✓ 승인</button>
        <button onClick={onReject} style={rejectButtonStyle}>✗ 거절</button>
        <button onClick={onDelete} style={deleteButtonStyle}>삭제</button>
      </div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  position: 'absolute', inset: 0, overflowY: 'auto', backgroundColor: '#F2EFE9', paddingBottom: '16px',
}

const profileCardStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '48px 16px 20px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #F0F0F0',
}

const avatarStyle: React.CSSProperties = {
  width: '52px', height: '52px', backgroundColor: '#E8F7F6', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}

const adminBadgeStyle: React.CSSProperties = {
  padding: '2px 8px', backgroundColor: '#2BA8A0', color: '#FFFFFF',
  borderRadius: '100px', fontSize: '10px', fontWeight: 700,
}

const logoutButtonStyle: React.CSSProperties = {
  background: 'none', border: 'none', padding: '8px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', borderRadius: '50%',
}

const tabBarStyle: React.CSSProperties = {
  display: 'flex', backgroundColor: '#FFFFFF', borderBottom: '1px solid #F0F0F0',
}

function tabStyle(isActive: boolean): React.CSSProperties {
  return {
    flex: 1, padding: '14px', fontSize: '14px', fontWeight: 700, border: 'none',
    backgroundColor: 'transparent', cursor: 'pointer',
    color: isActive ? '#2BA8A0' : '#AAAAAA',
    borderBottom: isActive ? '2px solid #2BA8A0' : '2px solid transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
  }
}

const badgeStyle: React.CSSProperties = {
  backgroundColor: '#2BA8A0', color: '#FFFFFF', borderRadius: '100px',
  fontSize: '10px', fontWeight: 700, padding: '1px 6px',
}

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 16px 12px',
}

const gridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '0 16px',
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)', cursor: 'pointer', position: 'relative',
}

const cardImageStyle: React.CSSProperties = {
  width: '100%', height: '120px', objectFit: 'cover', display: 'block',
}

const imagePlaceholderStyle: React.CSSProperties = {
  width: '100%', height: '120px', backgroundColor: '#E8F7F6',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const heartButtonStyle: React.CSSProperties = {
  position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px',
  backgroundColor: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
}

const tagStyle: React.CSSProperties = {
  display: 'inline-block', padding: '3px 8px', backgroundColor: '#E8F7F6',
  borderRadius: '100px', fontSize: '10px', fontWeight: 700, color: '#2BA8A0',
}

const cardNameStyle: React.CSSProperties = {
  fontSize: '14px', fontWeight: 700, color: '#1A1A1A', marginTop: '6px',
  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
}

const adminCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}

const approveButtonStyle: React.CSSProperties = {
  flex: 1, padding: '8px', backgroundColor: '#2BA8A0', color: '#FFFFFF',
  border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
}

const rejectButtonStyle: React.CSSProperties = {
  flex: 1, padding: '8px', backgroundColor: '#F0F0F0', color: '#666666',
  border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
}

const deleteButtonStyle: React.CSSProperties = {
  padding: '8px 12px', backgroundColor: '#FEF2F2', color: '#DC2626',
  border: '1px solid #FECACA', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
}

const emptyStyle: React.CSSProperties = {
  color: '#AAAAAA', fontSize: '14px', textAlign: 'center',
}

const goMapButtonStyle: React.CSSProperties = {
  display: 'inline-block', marginTop: '16px', padding: '10px 20px',
  backgroundColor: '#2BA8A0', color: '#FFFFFF', border: 'none', borderRadius: '100px',
  fontSize: '14px', fontWeight: 600, cursor: 'pointer',
}

export default MyPage
