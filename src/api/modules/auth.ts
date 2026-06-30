import request from '@/utils/request'

export interface LoginData {
  email: string
  password: string
}

export interface LoginResult {
  access_token: string
  refresh_token: string
  expires_in: number
  user: {
    id: string
    nickname: string
    avatar_url: string | null
    role: string
    status: string
  }
}

export interface UserInfo {
  id: string
  email: string
  nickname: string
  avatar_url: string | null
  gender: string | null
  birthday: string | null
  bio: string | null
  interest_tags: string[]
  role: string
  credit_score: number
  created_at: string
}

export function login(data: LoginData) {
  return request.post<LoginResult>('/auth/login', data, {
    headers: { 'Skip-Auth': 'true' },
  })
}

export function getMyInfo() {
  return request.get<UserInfo>('/users/me')
}

export function refreshToken(refreshToken: string) {
  return request.post<{ access_token: string; refresh_token: string; expires_in: number }>(
    '/auth/refresh',
    { refresh_token: refreshToken },
  )
}
