import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { ChevronLeftIcon } from '../components/common/Icons'

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
      {/* 헤더 */}
      <div style={headerStyle}>
        <button onClick={() => navigate('/login')} style={backButtonStyle}>
          <ChevronLeftIcon size={24} color="#1A1A1A" />
        </button>
        <h1 style={titleStyle}>회원가입</h1>
        <div style={{ width: '32px' }} />
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <Field label="이메일">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일 입력"
            required
            style={inputStyle}
          />
        </Field>

        <Field label="비밀번호 (8자 이상)">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            required
            minLength={8}
            style={inputStyle}
          />
        </Field>

        <Field label="닉네임 (2~20자)">
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="닉네임 입력"
            required
            minLength={2}
            maxLength={20}
            style={inputStyle}
          />
        </Field>

        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
          {isSubmitting ? '가입 중...' : '가입 완료하기'}
        </button>
      </form>

      <p style={linkStyle}>
        이미 계정이 있으신가요?{' '}
        <Link to="/login" style={{ color: '#2BA8A0', fontWeight: 700, textDecoration: 'underline' }}>
          로그인
        </Link>
      </p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#666666' }}>{label}</label>
      {children}
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '48px 16px 20px',
  borderBottom: '1px solid #F0F0F0',
}

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
}

const titleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 800,
  color: '#1A1A1A',
}

const formStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px 32px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 14px',
  border: '1.5px solid #E0E0E0',
  borderRadius: '14px',
  fontSize: '14px',
  color: '#1A1A1A',
  backgroundColor: '#F9F9F9',
}

const errorStyle: React.CSSProperties = {
  color: '#DC2626',
  fontSize: '13px',
  margin: 0,
}

const submitButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#2BA8A0',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: '8px',
  boxShadow: '0 4px 12px rgba(43,168,160,0.3)',
}

const linkStyle: React.CSSProperties = {
  color: '#AAAAAA',
  fontSize: '14px',
  textAlign: 'center',
  padding: '20px 32px 40px',
}

export default SignupPage
