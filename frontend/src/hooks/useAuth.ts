import { useState, useCallback } from 'react'
import type { User, LoginRequest, SignupRequest } from '../types/auth'
import * as authApi from '../api/authApi'

const TOKEN_KEY = 'ramap_token'

// 인증 상태 관리 커스텀 훅 (AuthContext 내부에서만 사용)
export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)

  // localStorage에 토큰 저장 + 상태 업데이트
  const saveToken = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
  }, [])

  // 로그인 처리: 토큰 저장 + 유저 상태 설정 (role 포함)
  const login = useCallback(async (request: LoginRequest) => {
    const response = await authApi.login(request)
    saveToken(response.token)
    setUser({ id: '', email: response.email, nickname: response.nickname, role: response.role })
  }, [saveToken])

  // 회원가입 처리: 토큰 저장 + 유저 상태 설정 (role 포함)
  const signup = useCallback(async (request: SignupRequest) => {
    const response = await authApi.signup(request)
    saveToken(response.token)
    setUser({ id: '', email: response.email, nickname: response.nickname, role: response.role })
  }, [saveToken])

  // 로그아웃: 토큰/유저 상태 초기화
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  // 앱 초기 로드 시 저장된 토큰으로 유저 정보 복원
  const restoreSession = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (!storedToken) return
    try {
      const userInfo = await authApi.getMe(storedToken)
      setToken(storedToken)
      setUser(userInfo)
    } catch {
      // 토큰 만료 또는 유효하지 않으면 제거
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
    }
  }, [])

  return {
    token,
    user,
    isAuthenticated: token !== null && user !== null,
    login,
    signup,
    logout,
    restoreSession,
  }
}
