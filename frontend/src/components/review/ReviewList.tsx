import { deleteReview } from '../../api/reviewApi'
import type { Review } from '../../types/review'
import StarRating from './StarRating'

interface Props {
  shopId: string
  reviews: Review[]
  onDeleted: () => void
}

// 리뷰 목록 컴포넌트
function ReviewList({ shopId, reviews, onDeleted }: Props) {
  if (reviews.length === 0) {
    return (
      <div style={emptyStyle}>
        <span style={{ fontSize: '28px' }}>🍜</span>
        <p style={{ fontSize: '14px', color: '#AAAAAA', marginTop: '8px' }}>아직 리뷰가 없어요. 첫 번째 리뷰를 남겨보세요!</p>
      </div>
    )
  }

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview(shopId, reviewId)
      onDeleted()
    } catch {
      alert('리뷰 삭제에 실패했습니다.')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#E0E0E0', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {reviews.map((review) => (
        <div key={review.id} style={reviewItemStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A' }}>{review.authorNickname}</span>
                <StarRating value={review.rating} />
              </div>
              <span style={{ fontSize: '12px', color: '#AAAAAA' }}>
                {new Date(review.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <button onClick={() => handleDelete(review.id)} style={deleteButtonStyle}>삭제</button>
          </div>
          <p style={{ fontSize: '14px', color: '#444444', marginTop: '10px', lineHeight: '1.6' }}>{review.content}</p>
        </div>
      ))}
    </div>
  )
}

const emptyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '32px 0',
}

const reviewItemStyle: React.CSSProperties = {
  padding: '16px',
  backgroundColor: '#FFFFFF',
}

const deleteButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '12px',
  color: '#AAAAAA',
  cursor: 'pointer',
  padding: 0,
  flexShrink: 0,
}

export default ReviewList
