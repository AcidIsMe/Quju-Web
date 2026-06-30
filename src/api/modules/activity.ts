import request from '@/utils/request'
import type { ApiResponse } from './types'

export interface ActivityItem {
  id: string
  title: string
  description: string
  tags: string[]
  activity_type: string | null
  status: string
  start_time: string
  end_time: string
  max_participants: number
  current_participants: number
  location_name: string | null
  creator: { id: string; nickname: string }
  created_at: string
}

export interface ActivityDetail extends ActivityItem {
  registration_deadline: string
  min_credit_score: number
  location_lat: number | null
  location_lng: number | null
  review_reason: string | null
  is_team_activity: boolean
  team_id: string | null
  registration_status: string
}

export function getActivityList(params: {
  q?: string
  status?: string
  cursor?: string
  limit?: number
}) {
  return request.get<unknown, ApiResponse<ActivityItem[]>>('/admin/activities', { params })
}

export function reviewActivity(data: {
  id: string
  action: 'approve' | 'reject' | 'request_changes'
  reason?: string
}) {
  return request.post<unknown, ApiResponse<ActivityItem>>(`/admin/activities/${data.id}/review`, {
    action: data.action,
    reason: data.reason,
  })
}

export function takeDownActivity(id: string, reason: string) {
  return request.post<unknown, ApiResponse<void>>(`/admin/activities/${id}/take-down`, { reason })
}

export function restoreActivity(id: string) {
  return request.post<unknown, ApiResponse<void>>(`/admin/activities/${id}/restore`)
}
