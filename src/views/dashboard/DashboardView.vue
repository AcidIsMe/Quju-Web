<template>
  <div class="dashboard">
    <!-- 欢迎 -->
    <div class="page-header">
      <div>
        <h2>首页概览</h2>
        <p class="page-desc">欢迎回来，以下是平台的运行概况</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="refresh">刷新数据</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-inner">
            <div class="stat-icon user-icon">
              <el-icon :size="28"><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.users }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-inner">
            <div class="stat-icon activity-icon">
              <el-icon :size="28"><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.activities }}</div>
              <div class="stat-label">活动总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-inner">
            <div class="stat-icon review-icon">
              <el-icon :size="28"><EditPen /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pendingReviews }}</div>
              <div class="stat-label">待审核活动</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-inner">
            <div class="stat-icon merchant-icon">
              <el-icon :size="28"><Shop /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.merchants }}</div>
              <div class="stat-label">商家总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 + 最近活动 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="quick-card">
          <template #header>
            <span class="card-title">快捷操作</span>
          </template>
          <div class="quick-actions">
            <el-button @click="$router.push('/activities/review')" class="quick-btn">
              <el-icon><EditPen /></el-icon>
              <span>审核活动</span>
            </el-button>
            <el-button @click="$router.push('/activities')" class="quick-btn">
              <el-icon><Calendar /></el-icon>
              <span>活动列表</span>
            </el-button>
            <el-button @click="$router.push('/users')" class="quick-btn">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-button>
            <el-button @click="$router.push('/merchants/review')" class="quick-btn">
              <el-icon><Shop /></el-icon>
              <span>商家审核</span>
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card class="recent-card">
          <template #header>
            <span class="card-title">最近活动</span>
          </template>
          <el-table :data="recentActivities" stripe v-loading="loading">
            <el-table-column prop="title" label="活动名称" min-width="160" show-overflow-tooltip />
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="row.statusType" size="small">{{ row.statusLabel }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdBy" label="发起人" width="120" />
            <el-table-column prop="createdAt" label="时间" width="160" />
          </el-table>
          <div v-if="!loading && recentActivities.length === 0" class="empty-state">
            <el-empty description="暂无活动数据" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { UserFilled, Calendar, EditPen, Shop, User } from '@element-plus/icons-vue'

const loading = ref(false)

interface StatItem {
  users: number
  activities: number
  pendingReviews: number
  merchants: number
}

const stats = reactive<StatItem>({
  users: 0,
  activities: 0,
  pendingReviews: 0,
  merchants: 0,
})

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
    // TODO: 对接后端统计接口
    // const res = await getDashboardStats()
    // stats.users = res.users
    // ...
    loadDemoData()
  } finally {
    loading.value = false
  }
}

onMounted(refresh)
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #1a1a2e;
  font-size: 22px;
}

.page-desc {
  margin: 4px 0 0;
  color: #909399;
  font-size: 13px;
}

.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-icon {
  background: #e6f7ff;
  color: #1890ff;
}

.activity-icon {
  background: #f6ffed;
  color: #52c41a;
}

.review-icon {
  background: #fff7e6;
  color: #fa8c16;
}

.merchant-icon {
  background: #f0f0ff;
  color: #722ed1;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quick-btn {
  height: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fafafa;
  font-size: 13px;
}

.quick-btn:hover {
  border-color: #409eff;
  color: #409eff;
  background: #ecf5ff;
}

.recent-card {
  min-height: 320px;
}

.empty-state {
  padding: 40px 0;
}

@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
