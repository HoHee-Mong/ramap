import { Link, useLocation } from 'react-router-dom'
import { MapIcon, SearchIcon, PlusIcon, UserIcon } from './Icons'

// 하단 탭 내비게이션
function BottomNav() {
  const { pathname } = useLocation()

  const isHome = pathname === '/'
  const isSearch = pathname === '/search'
  const isRegister = pathname === '/register'
  const isMy = pathname === '/my'

  return (
    <nav style={navStyle}>
      <Link to="/" style={tabStyle(isHome)}>
        <MapIcon size={24} color={isHome ? '#1A1A1A' : '#AAAAAA'} />
        <span style={labelStyle(isHome)}>홈</span>
      </Link>

      <Link to="/search" style={tabStyle(isSearch)}>
        <SearchIcon size={24} color={isSearch ? '#1A1A1A' : '#AAAAAA'} />
        <span style={labelStyle(isSearch)}>검색</span>
      </Link>

      {/* 가운데 FAB 버튼 */}
      <div style={fabWrapperStyle}>
        <Link to="/register" style={fabStyle(isRegister)}>
          <PlusIcon size={28} color="#FFFFFF" />
        </Link>
        <span style={fabLabelStyle}>등록</span>
      </div>

      <Link to="/my" style={tabStyle(isMy)}>
        <UserIcon size={24} color={isMy ? '#1A1A1A' : '#AAAAAA'} />
        <span style={labelStyle(isMy)}>마이</span>
      </Link>
    </nav>
  )
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  backgroundColor: '#FFFFFF',
  borderTop: '1px solid #F0F0F0',
  padding: '8px 16px 16px',
  boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
  zIndex: 20,
  flexShrink: 0,
}

function tabStyle(isActive: boolean): React.CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    textDecoration: 'none',
    color: isActive ? '#1A1A1A' : '#AAAAAA',
  }
}

function labelStyle(isActive: boolean): React.CSSProperties {
  return {
    fontSize: '10px',
    fontWeight: 700,
    color: isActive ? '#1A1A1A' : '#AAAAAA',
  }
}

// FAB 버튼을 nav 위로 띄우는 컨테이너
const fabWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '-28px',
  gap: '2px',
}

function fabStyle(isActive: boolean): React.CSSProperties {
  return {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: isActive ? '#2BA8A0' : '#1A1A1A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    textDecoration: 'none',
    transition: 'background-color 0.15s',
  }
}

const fabLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  color: '#1A1A1A',
}

export default BottomNav
