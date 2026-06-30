<template>
  <div class="dashboard">
    <!-- 页头 -->
    <div class="page-header">
      <div>
        <h2 class="page-title">首页概览</h2>
        <p class="page-desc">欢迎回来，以下是平台的运行概况</p>
      </div>
      <el-button :loading="loading" @click="refresh" class="refresh-btn">
        <el-icon style="margin-right: 4px;"><Refresh /></el-icon>
        刷新数据
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in statCards" :key="stat.label" :style="{ '--card-accent': stat.color }">
        <div class="stat-icon-wrapper">
          <el-icon :size="22"><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-body">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">
            {{ stat.label }}
            <span v-if="stat.trend" class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
              <el-icon size="12"><Top v-if="stat.trend > 0" /><Bottom v-else /></el-icon>
              {{ Math.abs(stat.trend) }}%
            </span>
          </div>
        </div>
        <div class="stat-decoration"></div>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="content-grid">
      <!-- 最近活动表 -->
      <div class="content-card recent-card">
        <div class="content-card-header">
          <div class="card-title-row">
            <el-icon size="18" style="color: var(--brand);"><Calendar /></el-icon>
            <span>最近活动</span>
          </div>
          <el-tag size="small" type="info" round>实时</el-tag>
        </div>
        <el-table :data="recentActivities" v-loading="loading" class="dashboard-table" :header-cell-style="{ background: 'transparent' }" size="small">
          <el-table-column prop="title" label="活动名称" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="activity-name">{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.statusType" size="small" effect="plain" round>{{ row.statusLabel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="发起人" width="110" />
          <el-table-column prop="createdAt" label="时间" width="150" />
        </el-table>
        <div v-if="!loading && recentActivities.length === 0" class="empty-state">
          <el-empty description="暂无活动数据" />
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions-card">
        <div class="content-card-header">
          <div class="card-title-row">
            <el-icon size="18" style="color: var(--accent);"><Lightning /></el-icon>
            <span>快捷操作</span>
          </div>
        </div>
        <div class="quick-actions-grid">
          <div class="quick-action-item" @click="goToReview">
            <div class="qa-icon" style="background: oklch(0.93 0.04 220 / 0.3); color: var(--brand);">
              <el-icon><EditPen /></el-icon>
            </div>
            <span>活动审核</span>
            <el-tag v-if="stats.pendingReviews > 0" size="small" type="danger" class="qa-badge">{{ stats.pendingReviews }}</el-tag>
          </div>
          <div class="quick-action-item" @click="goToMerchants">
            <div class="qa-icon" style="background: oklch(0.95 0.06 70 / 0.3); color: var(--accent);">
              <el-icon><Shop /></el-icon>
            </div>
            <span>商家审核</span>
          </div>
          <div class="quick-action-item" @click="goToActivityList">
            <div class="qa-icon" style="background: oklch(0.94 0.05 155 / 0.3); color: oklch(0.62 0.15 155);">
              <el-icon><List /></el-icon>
            </div>
            <span>活动列表</span>
          </div>
          <div class="quick-action-item" @click="goToUsers">
            <div class="qa-icon" style="background: oklch(0.94 0.03 300 / 0.3); color: oklch(0.58 0.12 300);">
              <el-icon><User /></el-icon>
            </div>
            <span>用户管理</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserFilled, Calendar, EditPen, Shop, Refresh, Top, Bottom, Lightning, List } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)

const stats = reactive({
  users: 0,
  activities: 0,
  pendingReviews: 0,
  merchants: 0,
})

const statCards = computed(() => [
  {
    icon: UserFilled,
    label: '用户总数',
    value: stats.users,
    color: 'oklch(0.58 0.12 300)',
    trend: 12,
  },
  {
    icon: Calendar,
    label: '活动总数',
    value: stats.activities,
    color: 'oklch(0.62 0.18 225)',
    trend: 8,
  },
  {
    icon: EditPen,
    label: '待审核活动',
    value: stats.pendingReviews,
    color: 'oklch(0.72 0.14 75)',
    trend: -5,
  },
  {
    icon: Shop,
    label: '商家总数',
    value: stats.merchants,
    color: 'oklch(0.62 0.15 155)',
    trend: 15,
  },
])

interface RecentActivity {
  title: string
  statusType: string
  statusLabel: string
  createdBy: string
  createdAt: string
}

const recentActivities = ref<RecentActivity[]>([])

function loadDemoData() {
  stats.users = 128
  stats.activities = 45
  stats.pendingReviews = 6
  stats.merchants = 18

  recentActivities.value = [
    { title: '周末奥森徒步', statusType: 'success', statusLabel: '已发布', createdBy: '张三', createdAt: '2026-06-28 14:30' },
    { title: '周三桌游之夜', statusType: 'warning', statusLabel: '待审核', createdBy: '李四', createdAt: '2026-06-28 11:20' },
    { title: '城市骑行挑战', statusType: 'danger', statusLabel: '已驳回', createdBy: '王五', createdAt: '2026-06-27 16:45' },
    { title: '周末羽毛球', statusType: 'success', statusLabel: '已发布', createdBy: '赵六', createdAt: '2026-06-27 09:10' },
    { title: '摄影技巧分享会', statusType: 'warning', statusLabel: '待审核', createdBy: '钱七', createdAt: '2026-06-26 20:00' },
  ]
}

async function refresh() {
  loading.value = true
  try {
    loadDemoData()
    await new Promise(r => setTimeout(r, 400))
  } finally {
    loading.value = false
  }
}

function goToReview() { router.push('/activities/review') }
function goToMerchants() { router.push('/merchants/review') }
function goToActivityList() { router.push('/activities') }
function goToUsers() { router.push('/users') }

onMounted(refresh)
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

/* === Page Header === */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.page-desc {
  margin: 4px 0 0;
  color: var(--text-muted);
  font-size: 13px;
}

.refresh-btn {
  border-radius: 8px;
}

/* === Stats Grid === */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.25s ease;
  cursor: default;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: color-mix(in oklch, var(--card-accent) 20%, transparent);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: color-mix(in oklch, var(--card-accent) 12%, transparent);
  color: var(--card-accent);
  position: relative;
  z-index: 1;
}

.stat-body {
  flex: 1;
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  font-size: 11px;
  font-weight: 600;
}

.stat-trend.up { color: oklch(0.62 0.15 155); }
.stat-trend.down { color: oklch(0.60 0.18 25); }

.stat-decoration {
  position: absolute;
  right: 0;
  top: 0;
  width: 80px;
  height: 100%;
  background: linear-gradient(90deg, transparent, color-mix(in oklch, var(--card-accent) 4%, transparent));
  pointer-events: none;
}

/* === Content Grid === */
.content-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 16px;
}

.content-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.content-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

/* === Table === */
.dashboard-table {
  border: none;
}

.activity-name {
  font-weight: 500;
  color: var(--text-primary);
}

.empty-state {
  padding: 40px 0;
}

/* === Quick Actions === */
.quick-actions-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.quick-action-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 12px;
  border-radius: 10px;
  border: 1px solid var(--border-muted);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.quick-action-item:hover {
  border-color: oklch(0.82 0.08 218 / 0.4);
  background: oklch(0.96 0.02 235 / 0.3);
  color: var(--text-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.qa-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qa-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

/* === Responsive === */
@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .content-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
