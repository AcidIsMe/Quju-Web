<template>
  <el-container class="app-container">
    <Sidebar />
    <el-container class="right-container">
      <header class="app-header">
        <div class="header-left">
          <!-- 面包屑 -->
          <el-breadcrumb class="page-breadcrumb">
            <el-breadcrumb-item v-if="route.name === 'Dashboard'">
              <el-icon style="vertical-align: middle; margin-right: 4px;"><Odometer /></el-icon>
              首页
            </el-breadcrumb-item>
            <template v-else>
              <el-breadcrumb-item :to="{ path: '/' }">
                <el-icon style="vertical-align: middle; margin-right: 4px;"><HomeFilled /></el-icon>
                首页
              </el-breadcrumb-item>
              <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <!-- 刷新按钮 -->
          <div class="header-action-btn" title="刷新当前页" @click="refreshPage">
            <el-icon size="16"><Refresh /></el-icon>
          </div>

          <!-- 用户信息 -->
          <el-dropdown trigger="click" class="user-dropdown">
            <span class="user-info">
              <el-avatar :size="32" class="user-avatar">
                {{ avatarText }}
              </el-avatar>
              <span class="username">{{ authStore.adminInfo?.nickname || '管理员' }}</span>
              <el-icon class="dropdown-arrow" size="14"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <el-main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Sidebar from './Sidebar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const avatarText = computed(() => {
  const name = authStore.adminInfo?.nickname || '管理'
  return name.charAt(0)
})

function logout() {
  authStore.logout()
}

function refreshPage() {
  const { path, query } = route
  router.push({ path, query })
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  background: var(--bg-page);
}

.right-container {
  flex-direction: column;
  overflow: hidden;
}

/* === Header === */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 28px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
  z-index: 5;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-action-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.header-action-btn:hover {
  background: var(--sidebar-hover-bg);
  color: var(--brand);
}

/* === Breadcrumb === */
.page-breadcrumb :deep(.el-breadcrumb__inner) {
  color: var(--text-muted);
  font-size: 13px;
  display: inline-flex;
  align-items: center;
}

.page-breadcrumb :deep(.el-breadcrumb__inner.is-link) {
  color: var(--text-muted);
  font-weight: 400;
}

.page-breadcrumb :deep(.el-breadcrumb__inner.is-link:hover) {
  color: var(--brand);
}

.page-breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--text-primary);
  font-weight: 500;
}

/* === User === */
.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 8px;
  transition: all 0.15s;
}

.user-info:hover {
  background: var(--sidebar-hover-bg);
}

.user-avatar {
  background: linear-gradient(135deg, var(--brand), var(--brand-light));
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.username {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  color: var(--text-muted);
  transition: transform 0.2s;
}

.user-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

/* === Main === */
.app-main {
  background: transparent;
  padding: 24px 28px;
  overflow-y: auto;
}

/* === Page transition === */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
