import { useParams, useNavigate } from 'react-router-dom'
import useShop from '../hooks/useShop'
import useReviews from '../hooks/useReviews'
import { useFavorite } from '../hooks/useFavorite'
import { useAuthContext } from '../context/AuthContext'
import ReviewList from '../components/review/ReviewList'
import ReviewForm from '../components/review/ReviewForm'
import {
  ChevronLeftIcon, HeartIcon, StarIcon,
  MapPinIcon, ClockIcon, PhoneIcon,
} from '../components/common/Icons'

// 카카오 공유 메시지 전송 (Kakao SDK 초기화 포함)
function shareViaKakao(shopName: string, address: string, shopId: string) {
  const kakao = window.Kakao
  if (!kakao) return
  if (!kakao.isInitialized()) {
    kakao.init(import.meta.env.VITE_KAKAO_MAP_KEY)
  }
  kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: shopName,
      description: address,
      imageUrl: 'https://ramapp.vercel.app/ramen-og.png',
      link: {
        mobileWebUrl: `${window.location.origin}/shops/${shopId}`,
        webUrl: `${window.location.origin}/shops/${shopId}`,
      },
    },
    buttons: [
      {
        title: '가게 보기',
        link: {
          mobileWebUrl: `${window.location.origin}/shops/${shopId}`,
          webUrl: `${window.location.origin}/shops/${shopId}`,
        },
      },
    ],
  })
}

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
        <p style={{ color: '#AAAAAA', textAlign: 'center', paddingTop: '80px' }}>불러오는 중...</p>
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div style={pageStyle}>
        <button onClick={() => navigate(-1)} style={backButtonOnlyStyle}>
          <ChevronLeftIcon size={24} color="#1A1A1A" />
        </button>
        <p style={{ color: '#DC2626', textAlign: 'center', marginTop: '80px' }}>
          {error ?? '가게를 찾을 수 없습니다.'}
        </p>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      {/* 상단 이미지 / 플레이스홀더 */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {shop.imageUrl ? (
          <img src={shop.imageUrl} alt={shop.name} style={heroImageStyle} />
        ) : (
          <div style={heroPlaceholderStyle}>
            <span style={{ fontSize: '64px' }}>🍜</span>
          </div>
        )}

        {/* 뒤로가기 버튼 */}
        <button onClick={() => navigate(-1)} style={backButtonOverlayStyle}>
          <ChevronLeftIcon size={22} color="#1A1A1A" />
        </button>

        {/* 즐겨찾기 버튼 (로그인 시에만 표시) */}
        {isAuthenticated && (
          <button
            onClick={toggleFavorite}
            disabled={isFavoriteLoading}
            style={favoriteOverlayStyle(isFavorite)}
            title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            <HeartIcon size={20} color={isFavorite ? '#EF4444' : '#6B7280'} filled={isFavorite} />
          </button>
        )}

        {/* 카카오톡 공유 버튼 */}
        <button
          onClick={() => shareViaKakao(shop.name, shop.address, id!)}
          style={shareButtonStyle}
          title="카카오톡으로 공유"
        >
          <span style={{ fontSize: '16px' }}>💬</span>
        </button>
      </div>

      {/* 스크롤 콘텐츠 */}
      <div style={contentStyle}>
        {/* 가게명 + 카테고리 + 별점 */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {shop.categories.map(cat => (
              <span key={cat.id} style={tagStyle}>{cat.name}</span>
            ))}
          </div>
          <h1 style={shopNameStyle}>{shop.name}</h1>
          {shop.reviewCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              <StarIcon size={16} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A' }}>
                {shop.averageRating.toFixed(1)}
              </span>
              <span style={{ fontSize: '14px', color: '#AAAAAA' }}>({shop.reviewCount})</span>
            </div>
          )}
        </div>

        {/* 가게 정보 카드 */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>가게 정보</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <InfoRow icon={<MapPinIcon size={18} color="#AAAAAA" />} text={shop.address} />
            {shop.businessHours && (
              <InfoRow icon={<ClockIcon size={18} color="#AAAAAA" />} text={shop.businessHours} />
            )}
            {shop.phone && (
              <InfoRow icon={<PhoneIcon size={18} color="#AAAAAA" />} text={shop.phone} />
            )}
          </div>
        </div>

        {/* 메뉴 카드 */}
        {shop.menu.length > 0 && (
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>대표 메뉴</h2>
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
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A' }}>
                  {item.price.toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 리뷰 섹션 */}
        <div style={{ ...cardStyle, marginBottom: '32px' }}>
          <h2 style={sectionTitleStyle}>리뷰 {shop.reviewCount > 0 && `(${shop.reviewCount})`}</h2>
          <ReviewForm shopId={id!} onSubmitted={refetch} />
          <div style={{ marginTop: '16px' }}>
            <ReviewList shopId={id!} reviews={reviews} onDeleted={refetch} />
          </div>
        </div>
      </div>
    </div>
  )
}

// 정보 행 컴포넌트
function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#444444' }}>
      <div style={{ marginTop: '1px', flexShrink: 0 }}>{icon}</div>
      <span style={{ lineHeight: '1.5' }}>{text}</span>
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

const heroImageStyle: React.CSSProperties = {
  width: '100%',
  height: '220px',
  objectFit: 'cover',
  display: 'block',
}

const heroPlaceholderStyle: React.CSSProperties = {
  width: '100%',
  height: '220px',
  backgroundColor: '#E8F7F6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const backButtonOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: '48px',
  left: '16px',
  width: '36px',
  height: '36px',
  backgroundColor: 'rgba(255,255,255,0.9)',
  border: 'none',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
}

const backButtonOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  top: '48px',
  left: '16px',
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

const shareButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '48px',
  right: '60px',
  width: '36px',
  height: '36px',
  backgroundColor: 'rgba(255,255,255,0.9)',
  border: 'none',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
}

function favoriteOverlayStyle(isFavorite: boolean): React.CSSProperties {
  return {
    position: 'absolute',
    top: '48px',
    right: '16px',
    width: '36px',
    height: '36px',
    backgroundColor: isFavorite ? '#FEF2F2' : 'rgba(255,255,255,0.9)',
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  }
}

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: '20px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const sectionStyle: React.CSSProperties = {
  paddingBottom: '4px',
}

const shopNameStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 800,
  color: '#1A1A1A',
  lineHeight: 1.3,
}

const tagStyle: React.CSSProperties = {
  padding: '4px 12px',
  backgroundColor: '#E8F7F6',
  borderRadius: '100px',
  fontSize: '12px',
  fontWeight: 700,
  color: '#2BA8A0',
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#1A1A1A',
  marginBottom: '14px',
}

export default ShopDetailPage
