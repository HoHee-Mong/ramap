// 앱 루트 컴포넌트
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/global.css'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import ProtectedRoute from './components/common/ProtectedRoute'
import HomePage from './pages/HomePage'
import RegisterShopPage from './pages/RegisterShopPage'
import ShopDetailPage from './pages/ShopDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
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
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
