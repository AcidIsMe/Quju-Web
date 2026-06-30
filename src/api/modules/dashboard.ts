import request from '@/utils/request'
import type { ApiResponse } from './types'

export interface DashboardStats {
  users: number
  activities: number
  pending_reviews: number
  merchants: number
  pending_merchants: number
}

export interface DashboardActivity {
  id: string
  title: string
  status: string
  created_at: string
  creator: {
    id: string
    nickname: string
  } | null
}

export interface DashboardOverview {
  stats: DashboardStats
  recent_activities: DashboardActivity[]
}

export function getDashboardOverview() {
  return request.get<unknown, ApiResponse<DashboardOverview>>('/admin/dashboard')
}
