<template>
  <el-aside :width="isCollapse ? '64px' : '220px'" class="app-sidebar">
    <div class="logo" @click="router.push('/')">
      <img v-if="!isCollapse" src="/logo-horizontal.svg" alt="趣聚平台" class="logo-img" />
      <img v-else src="/logo.svg" alt="" class="logo-icon-small" />
    </div>
    <el-menu
      :default-active="route.path"
      :collapse="isCollapse"
      :collapse-transition="false"
      background-color="#001529"
      text-color="#ffffffb3"
      active-text-color="#fff"
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

    <div class="collapse-btn" @click="isCollapse = !isCollapse">
      <el-icon>
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>
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
  background: #001529;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  overflow: hidden;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.logo-img {
  height: 36px;
  width: auto;
}
.logo-icon-small {
  height: 28px;
  width: 28px;
  color: #4fc3f7;
}
.el-menu {
  border-right: none;
  flex: 1;
}
.collapse-btn {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffffb3;
  cursor: pointer;
  border-top: 1px solid #ffffff1a;
}
.collapse-btn:hover {
  color: #fff;
}
</style>
