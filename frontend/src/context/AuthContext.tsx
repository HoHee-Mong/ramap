import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { User, LoginRequest, SignupRequest } from '../types/auth'

// AuthContext 타입 정의
interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (request: LoginRequest) => Promise<void>
  signup: (request: SignupRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// 앱 전역에 인증 상태를 제공하는 Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  // 앱 초기 마운트 시 저장된 토큰으로 세션 복원
  useEffect(() => {
    auth.restoreSession()
  }, [])

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

// AuthContext 사용 커스텀 훅
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthContext는 AuthProvider 안에서만 사용할 수 있습니다')
  return context
}
