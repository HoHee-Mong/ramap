import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'

// 상단 고정 네비게이션 바
function Navbar() {
  const { isAuthenticated, user, logout } = useAuthContext()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <svg width="320" height="72" viewBox="0 0 680 160" xmlns="http://www.w3.org/2000/svg">
          <path d="M62 130 L80 122 L138 122 L120 130 Z" fill="#2a2a2a" stroke="#444" strokeWidth="0.8"/>
          <path d="M62 130 L120 130 L120 138 L62 138 Z" fill="#222" stroke="#444" strokeWidth="0.8"/>
          <path d="M120 130 L138 122 L138 130 L120 138 Z" fill="#333" stroke="#444" strokeWidth="0.8"/>
          <line x1="75" y1="126" x2="130" y2="124" stroke="#444" strokeWidth="0.6"/>
          <line x1="88" y1="123" x2="94" y2="131" stroke="#444" strokeWidth="0.6"/>
          <line x1="112" y1="122" x2="117" y2="130" stroke="#444" strokeWidth="0.6"/>
          <line x1="100" y1="126" x2="100" y2="110" stroke="#E8001C" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="100" cy="127" r="3" fill="#E8001C"/>
          <circle cx="100" cy="127" r="6" fill="none" stroke="#E8001C" strokeWidth="1" opacity="0.5"/>
          <path d="M68 66 Q68 102 100 106 Q132 102 132 66 Z" fill="#E8001C"/>
          <rect x="90" y="104" width="20" height="6" rx="3" fill="#c0001a"/>
          <ellipse cx="100" cy="66" rx="32" ry="7" fill="#c0001a"/>
          <ellipse cx="100" cy="66" rx="28" ry="5" fill="#1A1A1A"/>
          <ellipse cx="93" cy="63" rx="9" ry="3.5" fill="none" stroke="#F5F5F5" strokeWidth="1.5"/>
          <ellipse cx="93" cy="63" rx="5" ry="2" fill="none" stroke="#F5F5F5" strokeWidth="1"/>
          <ellipse cx="109" cy="61" rx="7" ry="3" fill="none" stroke="#F5F5F5" strokeWidth="1.5"/>
          <ellipse cx="109" cy="61" rx="4" ry="1.5" fill="none" stroke="#F5F5F5" strokeWidth="1"/>
          <path d="M91 59 Q88 50 85 42 Q83 36 87 30" fill="none" stroke="#F5F5F5" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M97 58 Q96 48 95 40 Q94 33 98 28" fill="none" stroke="#F5F5F5" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M103 57 Q105 47 107 39 Q109 32 114 28" fill="none" stroke="#F5F5F5" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="84" y1="27" x2="103" y2="46" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round"/>
          <line x1="91" y1="25" x2="110" y2="44" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round"/>
          <line x1="158" y1="20" x2="158" y2="140" stroke="#333" strokeWidth="1"/>
          <text x="176" y="76" fontSize="46" fontWeight="800" letterSpacing="5" fontFamily="Nunito, Arial Rounded MT Bold, sans-serif" fill="#F5F5F5">RAMAP</text>
          <rect x="176" y="84" width="220" height="2" fill="#E8001C" rx="1"/>
          <text x="176" y="106" fontSize="12" letterSpacing="1.2" fontFamily="Noto Sans KR, sans-serif" fontWeight="500" fill="#AAAAAA">라맵 : 라멘 오타쿠들의 발자취</text>
          <text x="176" y="126" fontSize="11" letterSpacing="2" fontFamily="Georgia, serif" fill="#555">ラーメン マップ</text>
        </svg>
      </Link>
      <div style={navActionsStyle}>
        {isAuthenticated ? (
          <>
            <Link to="/my" style={nicknameStyle}>{user?.nickname}</Link>
            <Link to="/register" style={registerButtonStyle}>+ 가게 등록</Link>
            <button onClick={handleLogout} style={logoutButtonStyle}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" style={loginButtonStyle}>로그인</Link>
            <Link to="/signup" style={registerButtonStyle}>회원가입</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const navStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '72px',
  backgroundColor: '#1A1A1A',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 32px',
  zIndex: 100,
  boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
}

const navActionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const nicknameStyle: React.CSSProperties = {
  color: '#AAAAAA',
  fontSize: '13px',
  textDecoration: 'none',
}

const registerButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#E8001C',
  color: '#FFFFFF',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.3px',
}

const loginButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: 'transparent',
  color: '#AAAAAA',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 500,
  border: '1px solid #444',
}

const logoutButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: 'transparent',
  color: '#AAAAAA',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 500,
  border: '1px solid #444',
  cursor: 'pointer',
}

export default Navbar
