import { useParams, useNavigate } from 'react-router-dom'
import useShop from '../hooks/useShop'
import useReviews from '../hooks/useReviews'
import { useFavorite } from '../hooks/useFavorite'
import { useAuthContext } from '../context/AuthContext'
import ReviewList from '../components/review/ReviewList'
import ReviewForm from '../components/review/ReviewForm'
import StarRating from '../components/review/StarRating'

// 가게 상세 페이지
function ShopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, token } = useAuthContext()
  const { shop, isLoading, error } = useShop(id!)
  const { reviews, refetch } = useReviews(id!)
  const { isFavorite, isLoading: isFavoriteLoading, toggleFavorite } = useFavorite({
    shopId: id!,
    token: isAuthenticated ? token : null,
  })

  if (isLoading) {
    return (
      <div style={pageStyle}>
        <p style={{ color: '#AAAAAA', textAlign: 'center', paddingTop: '60px' }}>불러오는 중...</p>
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div style={pageStyle}>
        <p style={{ color: '#E8001C', marginBottom: '16px' }}>{error ?? '가게를 찾을 수 없습니다.'}</p>
        <button onClick={() => navigate('/')} style={backButtonStyle}>← 지도로 돌아가기</button>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <button onClick={() => navigate('/')} style={backButtonStyle}>← 지도로 돌아가기</button>

      {/* 가게 헤더 카드 */}
      <div style={headerCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }}>{shop.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {shop.reviewCount > 0 && (
              <div style={ratingBadgeStyle}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#E8001C' }}>★ {shop.averageRating.toFixed(1)}</span>
                <span style={{ fontSize: '11px', color: '#AAAAAA', marginLeft: '4px' }}>({shop.reviewCount})</span>
              </div>
            )}
            {/* 로그인 시에만 즐겨찾기 버튼 표시 */}
            {isAuthenticated && (
              <button
                onClick={toggleFavorite}
                disabled={isFavoriteLoading}
                style={favoriteButtonStyle}
                title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              >
                {isFavorite ? '♥' : '♡'}
              </button>
            )}
          </div>
        </div>

        {/* 카테고리 태그 */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
          {shop.categories.map((category) => (
            <span key={category.id} style={tagStyle}>{category.name}</span>
          ))}
        </div>
      </div>

      {/* 기본 정보 카드 */}
      <div style={cardStyle}>
        <SectionTitle>정보</SectionTitle>
        <InfoRow label="주소" value={shop.address} />
        {shop.phone && <InfoRow label="전화번호" value={shop.phone} />}
        {shop.businessHours && <InfoRow label="영업시간" value={shop.businessHours} />}
      </div>

      {/* 메뉴 카드 */}
      {shop.menu.length > 0 && (
        <div style={cardStyle}>
          <SectionTitle>메뉴</SectionTitle>
          {shop.menu.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: index < shop.menu.length - 1 ? '1px solid #F0F0F0' : 'none',
              }}
            >
              <span style={{ fontSize: '14px', color: '#1A1A1A' }}>{item.name}</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>{item.price.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      )}

      {/* 리뷰 섹션 */}
      <div style={{ ...cardStyle, paddingBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <SectionTitle>리뷰</SectionTitle>
          {shop.reviewCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <StarRating value={Math.round(shop.averageRating)} />
              <span style={{ fontSize: '13px', color: '#666666' }}>{shop.reviewCount}개</span>
            </div>
          )}
        </div>
        <ReviewForm shopId={id!} onSubmitted={refetch} />
        <div style={{ marginTop: '20px' }}>
          <ReviewList shopId={id!} reviews={reviews} onDeleted={refetch} />
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A', marginBottom: '14px' }}>{children}</h2>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', fontSize: '14px' }}>
      <span style={{ color: '#AAAAAA', minWidth: '64px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1A1A1A' }}>{value}</span>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  maxWidth: '520px',
  margin: '0 auto',
  padding: '80px 16px 40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '14px',
  color: '#666666',
  cursor: 'pointer',
  padding: 0,
  textAlign: 'left',
}

const headerCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: 'var(--radius-lg)',
  padding: '20px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: 'var(--radius-lg)',
  padding: '20px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
}

const ratingBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FFF5F5',
  border: '1px solid #FFE0E0',
  borderRadius: 'var(--radius-pill)',
  padding: '4px 10px',
  flexShrink: 0,
}

const favoriteButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '22px',
  cursor: 'pointer',
  padding: '2px 4px',
  color: '#E8001C',
  lineHeight: 1,
}

const tagStyle: React.CSSProperties = {
  padding: '4px 12px',
  backgroundColor: '#E8001C',
  borderRadius: 'var(--radius-pill)',
  fontSize: '12px',
  fontWeight: 600,
  color: '#FFFFFF',
  letterSpacing: '0.3px',
}

export default ShopDetailPage
