<template>
  <el-aside :width="isCollapse ? '64px' : '230px'" class="app-sidebar">
    <div class="logo" @click="router.push('/')">
      <img src="/logo-horizontal.svg" alt="趣聚平台" class="logo-img" :class="{ collapsed: isCollapse }" />
      <img v-show="isCollapse" src="/logo.svg" alt="" class="logo-icon-small" />
    </div>

    <el-menu
      :default-active="route.path"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
    >
      <el-menu-item index="/dashboard">
        <el-icon><Odometer /></el-icon>
        <template #title>首页</template>
      </el-menu-item>

      <el-sub-menu index="activity">
        <template #title>
          <el-icon><Calendar /></el-icon>
          <span>活动管理</span>
        </template>
        <el-menu-item index="/activities/review">活动审核</el-menu-item>
        <el-menu-item index="/activities">活动列表</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/users">
        <el-icon><User /></el-icon>
        <template #title>用户管理</template>
      </el-menu-item>

      <el-menu-item index="/merchants/review">
        <el-icon><Shop /></el-icon>
        <template #title>商家审核</template>
      </el-menu-item>
    </el-menu>

    <div class="sidebar-footer">
      <div class="collapse-btn" @click="isCollapse = !isCollapse">
        <el-icon size="16">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
        <span v-show="!isCollapse" class="collapse-label">收起侧栏</span>
      </div>
    </div>

    <div class="sidebar-decoration">
      <div class="deco-dot deco-dot-1"></div>
      <div class="deco-dot deco-dot-2"></div>
      <div class="deco-dot deco-dot-3"></div>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
const isCollapse = ref(false)
</script>

<style scoped>
.app-sidebar {
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border-right: 1px solid var(--sidebar-border);
  box-shadow: var(--shadow-sidebar);
  position: relative;
  z-index: 10;
}

/* === Logo === */
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--sidebar-border);
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.logo-img {
  height: 30px;
  width: auto;
  transition: opacity 0.2s;
}

.logo-img.collapsed {
  opacity: 0;
}

.logo-icon-small {
  position: absolute;
  height: 30px;
  width: 30px;
}

/* === Menu === */
:deep(.el-menu) {
  border-right: none;
  flex: 1;
  padding: 12px 0;
  background: transparent;
}

:deep(.el-menu-item) {
  margin: 2px 10px;
  border-radius: 8px;
  width: auto;
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  font-weight: 500;
  color: var(--sidebar-text);
  position: relative;
}

:deep(.el-menu-item:hover) {
  background: var(--sidebar-hover-bg);
  color: var(--sidebar-text-active);
}

:deep(.el-menu-item.is-active) {
  background: oklch(0.93 0.04 220 / 0.4) !important;
  color: var(--brand) !important;
  font-weight: 600;
}

:deep(.el-menu-item.is-active::before) {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  border-radius: 0 3px 3px 0;
  background: var(--brand);
}

:deep(.el-sub-menu__title) {
  margin: 2px 10px;
  border-radius: 8px;
  width: auto;
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  font-weight: 500;
  color: var(--sidebar-text);
  padding-right: 36px;
}

:deep(.el-sub-menu__title:hover) {
  background: var(--sidebar-hover-bg);
  color: var(--sidebar-text-active);
}

:deep(.el-menu--collapse .el-menu-item),
:deep(.el-menu--collapse .el-sub-menu__title) {
  margin: 2px 6px;
  border-radius: 8px;
  padding: 0;
  justify-content: center;
}

:deep(.el-menu--collapse .el-menu-item.is-active::before) {
  left: -6px;
}

:deep(.el-sub-menu .el-menu) {
  padding: 4px 0;
}

:deep(.el-sub-menu .el-menu .el-menu-item) {
  padding-left: 48px !important;
  height: 38px;
  line-height: 38px;
  font-size: 13px;
}

:deep(.el-sub-menu .el-menu .el-menu-item.is-active) {
  background: oklch(0.93 0.04 220 / 0.4) !important;
}

/* === Footer === */
.sidebar-footer {
  border-top: 1px solid var(--sidebar-border);
  flex-shrink: 0;
  padding: 8px 10px;
  position: relative;
  z-index: 1;
}

.collapse-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--sidebar-text);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.collapse-btn:hover {
  background: var(--sidebar-hover-bg);
  color: var(--brand);
}

.collapse-label {
  white-space: nowrap;
}

/* === Decorative dots === */
.sidebar-decoration {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 6px;
  opacity: 0.25;
  pointer-events: none;
}

.deco-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.deco-dot-1 { background: var(--brand); }
.deco-dot-2 { background: var(--accent); }
.deco-dot-3 { background: var(--brand-light); }
</style>
