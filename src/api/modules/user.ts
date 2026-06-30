import request from '@/utils/request'
import type { ApiResponse } from './types'

export interface UserItem {
  id: string
  email: string
  nickname: string
  avatar_url: string | null
  role: 'personal' | 'merchant' | 'admin'
  status: string
  credit_score: number
  created_at: string
  activityCount?: number
  teamCount?: number
}

export interface UserDetail extends UserItem {
  gender: string | null
  birthday: string | null
  bio: string | null
  interest_tags: string[]
}

export function getUserList(params: {
  q?: string
  role?: string
  status?: string
  page?: number
  size?: number
}) {
  return request.get<unknown, ApiResponse<UserItem[]>>('/admin/users', { params })
}

export function getUserDetail(id: string) {
  return request.get<unknown, ApiResponse<UserDetail>>(`/admin/users/${id}`)
}

export function banUser(id: string, data: { reason: string; expires_at?: string }) {
  return request.post<unknown, ApiResponse<void>>(`/admin/users/${id}/ban`, data)
}

export function unbanUser(id: string) {
  return request.post<unknown, ApiResponse<void>>(`/admin/users/${id}/unban`)
}
