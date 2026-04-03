import type { AuthResponse, LoginRequest, SignupRequest, User } from '../types/auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// 회원가입 API 호출
export async function signup(request: SignupRequest): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}

// 로그인 API 호출
export async function login(request: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}

// 현재 로그인한 유저 정보 조회
export async function getMe(token: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}
