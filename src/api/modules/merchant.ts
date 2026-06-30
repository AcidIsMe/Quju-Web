import request from '@/utils/request'
import type { ApiResponse } from './types'

export interface MerchantItem {
  id: string
  user_id: string
  merchant_name: string
  merchant_nickname: string | null
  activity_domains: string[]
  license_image_url: string
  audit_status: 'pending' | 'approved' | 'rejected'
  audit_reason: string | null
  email?: string
  created_at: string
}

export function getMerchantPendingList(params: { page?: number; size?: number }) {
  return request.get<unknown, ApiResponse<MerchantItem[]>>('/admin/merchants/pending', { params })
}

export function approveMerchant(id: string) {
  return request.post<unknown, ApiResponse<void>>(`/admin/merchants/${id}/approve`)
}

export function rejectMerchant(id: string, reason: string) {
  return request.post<unknown, ApiResponse<void>>(`/admin/merchants/${id}/reject`, { reason })
}
