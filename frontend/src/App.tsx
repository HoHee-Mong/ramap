// 앱 루트 컴포넌트
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './styles/global.css'
import { AuthProvider } from './context/AuthContext'
import BottomNav from './components/common/BottomNav'
import ProtectedRoute from './components/common/ProtectedRoute'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import RegisterShopPage from './pages/RegisterShopPage'
import ShopDetailPage from './pages/ShopDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'

// 라우트 및 레이아웃 처리 (useLocation 사용을 위해 BrowserRouter 하위에 위치)
function AppInner() {
  const { pathname } = useLocation()
  const isAuthPage = ['/login', '/signup'].includes(pathname)

  return (
    <>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <RegisterShopPage />
              </ProtectedRoute>
            }
          />
          <Route path="/shops/:id" element={<ShopDetailPage />} />
          <Route
            path="/my"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!isAuthPage && <BottomNav />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="phone-frame">
          <AppInner />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
