import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, getMyInfo } from '@/api/modules/auth'
import type { LoginData } from '@/api/modules/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const refreshTokenVal = ref(localStorage.getItem('admin_refresh_token') || '')
  const adminInfo = ref<{ id: string; nickname: string; role: string } | null>(null)

  async function login(data: LoginData) {
    const res = await loginApi(data)
    const { access_token, refresh_token: newRefresh, user } = res.data
    token.value = access_token
    refreshTokenVal.value = newRefresh
    localStorage.setItem('admin_token', access_token)
    localStorage.setItem('admin_refresh_token', newRefresh)
    adminInfo.value = { id: user.id, nickname: user.nickname, role: user.role }
    router.push('/')
  }

  /** 演示模式：无需后端，直接进入后台 */
  function demoLogin() {
    token.value = 'demo_token'
    adminInfo.value = { id: 'demo', nickname: '管理员', role: 'admin' }
    localStorage.setItem('admin_token', 'demo_token')
    router.push('/')
  }

  async function fetchAdminInfo() {
    if (!token.value) return
    if (token.value === 'demo_token') return
    try {
      const res = await getMyInfo()
      adminInfo.value = { id: res.data.id, nickname: res.data.nickname, role: res.data.role }
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = ''
    refreshTokenVal.value = ''
    adminInfo.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_refresh_token')
    router.push('/login')
  }

  function isAuthenticated() {
    return !!token.value
  }

  return { token, adminInfo, login, demoLogin, fetchAdminInfo, logout, isAuthenticated }
})
