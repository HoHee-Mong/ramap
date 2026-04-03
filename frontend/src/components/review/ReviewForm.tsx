import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createReview } from '../../api/reviewApi'
import { useAuthContext } from '../../context/AuthContext'
import StarRating from './StarRating'

interface Props {
  shopId: string
  onSubmitted: () => void
}

// 리뷰 작성 폼 컴포넌트 (로그인 유저만 작성 가능)
function ReviewForm({ shopId, onSubmitted }: Props) {
  const { isAuthenticated, user, token } = useAuthContext()
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 비로그인 상태면 로그인 유도 메시지 표시
  if (!isAuthenticated) {
    return (
      <p style={{ color: '#AAAAAA', fontSize: '14px', padding: '12px 0' }}>
        리뷰를 작성하려면 <Link to="/login" style={{ color: '#E8001C' }}>로그인</Link>이 필요합니다.
      </p>
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (rating === 0) {
      setError('별점을 선택해주세요.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      // 로그인한 유저의 닉네임을 자동으로 사용
      await createReview(shopId, { authorNickname: user!.nickname, rating, content }, token!)
      setRating(0)
      setContent('')
      // 작성 완료 후 목록 새로고침
      onSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : '리뷰 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#666', flex: 1 }}>{user?.nickname} 님의 리뷰</span>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="리뷰를 작성해주세요."
        required
        rows={3}
        style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
      />

      {error && <p style={{ color: '#E8001C', fontSize: '13px' }}>{error}</p>}

      <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
        {isSubmitting ? '등록 중...' : '리뷰 등록'}
      </button>
    </form>
  )
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '16px',
  backgroundColor: '#F5F5F5',
  borderRadius: 'var(--radius-lg)',
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #E0E0E0',
  borderRadius: 'var(--radius-md)',
  fontSize: '14px',
  backgroundColor: '#FFFFFF',
}

const submitButtonStyle: React.CSSProperties = {
  padding: '11px',
  backgroundColor: '#1A1A1A',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  letterSpacing: '0.3px',
}

export default ReviewForm
