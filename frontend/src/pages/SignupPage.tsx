import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

// 회원가입 페이지
function SignupPage() {
  const { signup } = useAuthContext()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)
    try {
      await signup({ email, password, nickname })
      navigate('/')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '회원가입에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>회원가입</h1>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 입력"
              required
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>비밀번호 (8자 이상)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              required
              minLength={8}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>닉네임 (2~20자)</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력"
              required
              minLength={2}
              maxLength={20}
              style={inputStyle}
            />
          </div>
          {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
          <button type="submit" disabled={isSubmitting} style={buttonStyle}>
            {isSubmitting ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p style={linkStyle}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={{ color: '#E8001C' }}>로그인</Link>
        </p>
      </div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#111',
  paddingTop: '72px',
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  borderRadius: '12px',
  padding: '40px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
}

const titleStyle: React.CSSProperties = {
  color: '#F5F5F5',
  fontSize: '24px',
  fontWeight: 700,
  marginBottom: '32px',
  textAlign: 'center',
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const labelStyle: React.CSSProperties = {
  color: '#AAAAAA',
  fontSize: '13px',
  fontWeight: 500,
}

const inputStyle: React.CSSProperties = {
  backgroundColor: '#2A2A2A',
  border: '1px solid #333',
  borderRadius: '8px',
  padding: '10px 14px',
  color: '#F5F5F5',
  fontSize: '14px',
  outline: 'none',
}

const errorStyle: React.CSSProperties = {
  color: '#E8001C',
  fontSize: '13px',
  margin: 0,
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#E8001C',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '8px',
  padding: '12px',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '8px',
}

const linkStyle: React.CSSProperties = {
  color: '#777',
  fontSize: '13px',
  textAlign: 'center',
  marginTop: '20px',
}

export default SignupPage
