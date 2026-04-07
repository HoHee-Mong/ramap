import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { LockIcon, MailIcon } from '../components/common/Icons'

// 로그인 페이지
function LoginPage() {
  const { login } = useAuthContext()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)
    try {
      await login({ email, password })
      navigate('/')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '로그인에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={pageStyle}>
      {/* 로고 아이콘 */}
      <div style={iconWrapperStyle}>
        <LockIcon size={32} color="#2BA8A0" />
      </div>

      <h1 style={titleStyle}>로그인</h1>
      <p style={subtitleStyle}>라멘 오타쿠들의 발자취에 합류하세요!</p>

      <form onSubmit={handleSubmit} style={formStyle}>
        {/* 이메일 */}
        <div style={inputWrapperStyle}>
          <div style={inputIconStyle}>
            <MailIcon size={20} color="#AAAAAA" />
          </div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일"
            required
            style={inputStyle}
          />
        </div>

        {/* 비밀번호 */}
        <div style={inputWrapperStyle}>
          <div style={inputIconStyle}>
            <LockIcon size={20} color="#AAAAAA" />
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
            style={inputStyle}
          />
        </div>

        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <p style={linkStyle}>
        계정이 없으신가요?{' '}
        <Link to="/signup" style={{ color: '#2BA8A0', fontWeight: 700, textDecoration: 'underline' }}>
          회원가입
        </Link>
      </p>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 32px',
  backgroundColor: '#FFFFFF',
}

const iconWrapperStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  backgroundColor: '#E8F7F6',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
}

const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 900,
  color: '#1A1A1A',
  marginBottom: '8px',
}

const subtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#AAAAAA',
  marginBottom: '32px',
  textAlign: 'center',
}

const formStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const inputWrapperStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
}

const inputIconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '14px',
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'none',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 14px 13px 44px',
  border: '1.5px solid #E0E0E0',
  borderRadius: '14px',
  fontSize: '14px',
  color: '#1A1A1A',
  backgroundColor: '#F9F9F9',
  transition: 'border-color 0.15s',
}

const errorStyle: React.CSSProperties = {
  color: '#DC2626',
  fontSize: '13px',
  margin: 0,
}

const submitButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#1A1A1A',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: '8px',
}

const linkStyle: React.CSSProperties = {
  color: '#AAAAAA',
  fontSize: '14px',
  textAlign: 'center',
  marginTop: '24px',
}

export default LoginPage
