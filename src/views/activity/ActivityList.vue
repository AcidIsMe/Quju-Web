<template>
  <div class="page-container">
    <!-- 页头 -->
    <div class="page-header">
      <div>
        <h2 class="page-title">活动管理</h2>
        <p class="page-desc">查看、下架或恢复平台活动</p>
      </div>
    </div>

    <!-- 搜索 -->
    <div class="search-card">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.q" placeholder="活动名称" clearable @clear="fetchList" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option label="已发布" value="published" />
            <el-option label="待审核" value="pending_ai_review" />
            <el-option label="人工审核" value="pending_manual_review" />
            <el-option label="已驳回" value="rejected" />
            <el-option label="已下架" value="taken_down" />
            <el-option label="已结束" value="ended" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-card">
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="200" show-overflow-tooltip />
        <el-table-column prop="title" label="活动名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.type" size="small" effect="plain" round>
              {{ statusMap[row.status]?.label || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="max_participants" label="人数" width="80" align="center">
          <template #default="{ row }">
            {{ row.current_participants }}/{{ row.max_participants }}
          </template>
        </el-table-column>
        <el-table-column label="发起人" width="130">
          <template #default="{ row }">{{ row.creator?.nickname }}</template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row.id)">详情</el-button>
            <el-button
              v-if="row.status === 'published'"
              type="danger"
              link
              size="small"
              @click="handleTakeDown(row)"
            >下架</el-button>
            <el-button
              v-if="row.status === 'taken_down'"
              type="success"
              link
              size="small"
              @click="handleRestore(row)"
            >恢复</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-if="total > 0"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="fetchList"
          @size-change="fetchList"
        />
      </div>
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="活动详情" width="600px">
      <template v-if="detailLoading">
        <div class="detail-loading">加载中...</div>
      </template>
      <template v-else-if="detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="活动ID" :span="2">{{ detail.id }}</el-descriptions-item>
          <el-descriptions-item label="活动名称" :span="2">{{ detail.title }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusMap[detail.status]?.type" size="small" effect="plain" round>
              {{ statusMap[detail.status]?.label || detail.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="活动类型">{{ detail.activity_type || '-' }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ detail.start_time || '-' }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ detail.end_time || '-' }}</el-descriptions-item>
          <el-descriptions-item label="报名截止">{{ detail.registration_deadline || '-' }}</el-descriptions-item>
          <el-descriptions-item label="人数">{{ detail.current_participants }}/{{ detail.max_participants }}</el-descriptions-item>
          <el-descriptions-item label="发起人">{{ detail.creator?.nickname || '-' }}</el-descriptions-item>
          <el-descriptions-item label="信用分要求">{{ detail.min_credit_score ?? '-' }}</el-descriptions-item>
          <el-descriptions-item label="活动地点" :span="2">{{ detail.location_name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="标签" :span="2">
            <el-tag v-for="tag in detail.tags" :key="tag" size="small" style="margin-right: 4px">{{ tag }}</el-tag>
            <span v-if="!detail.tags?.length">-</span>
          </el-descriptions-item>
          <el-descriptions-item label="活动描述" :span="2">{{ detail.description || '-' }}</el-descriptions-item>
          <el-descriptions-item v-if="detail.review_reason" label="审核原因" :span="2">{{ detail.review_reason }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detail.created_at || '-' }}</el-descriptions-item>
          <el-descriptions-item label="是否组队">{{ detail.is_team_activity ? '是' : '否' }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>

    <!-- 下架对话框 -->
    <el-dialog v-model="dialog.visible" title="下架活动" width="420px">
      <el-form ref="dialogFormRef" :model="dialog" :rules="dialogRules">
        <el-form-item label="下架原因" prop="reason">
          <el-input
            v-model="dialog.reason"
            type="textarea"
            :rows="3"
            placeholder="请填写下架原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="danger" :loading="submitting" @click="confirmTakeDown">确认下架</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getActivityList, getActivityDetail, takeDownActivity, restoreActivity } from '@/api/modules/activity'
import type { ActivityItem, ActivityDetail } from '@/api/modules/activity'
import type { FormInstance } from 'element-plus'

const loading = ref(false)
const submitting = ref(false)
const list = ref<ActivityItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const queryParams = reactive({
  q: '',
  status: '',
})

const statusMap: Record<string, { label: string; type: string }> = {
  published: { label: '已发布', type: 'success' },
  pending_ai_review: { label: 'AI审核中', type: 'warning' },
  pending_manual_review: { label: '待人工审核', type: 'warning' },
  rejected: { label: '已驳回', type: 'danger' },
  draft: { label: '草稿', type: 'info' },
  taken_down: { label: '已下架', type: 'info' },
  ended: { label: '已结束', type: '' },
}

const dialogFormRef = ref<FormInstance>()
const dialog = reactive({
  visible: false,
  reason: '',
  targetId: '',
})
const dialogRules = {
  reason: [{ required: true, message: '请填写下架原因', trigger: 'blur' }],
}

const detailVisible = ref(false)
const detailLoading = ref(false)
const detail = ref<ActivityDetail | null>(null)

async function fetchList() {
  loading.value = true
  try {
    const params: any = { page: currentPage.value, size: pageSize.value }
    if (queryParams.q) params.q = queryParams.q
    if (queryParams.status) params.status = queryParams.status
    const res = await getActivityList(params)
    list.value = res.data
    total.value = res.pagination?.total || 0
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  queryParams.q = ''
  queryParams.status = ''
  currentPage.value = 1
  fetchList()
}

async function viewDetail(id: string) {
  detailVisible.value = true
  detailLoading.value = true
  detail.value = null
  try {
    const res = await getActivityDetail(id)
    detail.value = res.data
  } catch {
    ElMessage.error('获取活动详情失败')
    detailVisible.value = false
  } finally {
    detailLoading.value = false
  }
}

function handleTakeDown(row: ActivityItem) {
  dialog.visible = true
  dialog.reason = ''
  dialog.targetId = row.id
}

async function confirmTakeDown() {
  const valid = await dialogFormRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await takeDownActivity(dialog.targetId, dialog.reason)
    ElMessage.success('活动已下架')
    dialog.visible = false
    fetchList()
  } finally {
    submitting.value = false
  }
}

async function handleRestore(row: ActivityItem) {
  try {
    await ElMessageBox.confirm('确认恢复该活动？恢复后将在用户端重新上线。', '提示')
    await restoreActivity(row.id)
    ElMessage.success('活动已恢复')
    fetchList()
  } catch { /* 取消 */ }
}

onMounted(fetchList)
</script>

<style scoped>
.page-container { max-width: 1200px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-title { margin: 0; font-size: 22px; font-weight: 700; color: var(--text-primary); }
.page-desc { margin: 4px 0 0; color: var(--text-muted); font-size: 13px; }

.search-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 0;
  overflow: hidden;
  min-height: 400px;
}

.table-card :deep(.el-table) {
  border: none;
}

.pagination-wrapper {
  margin-top: 16px;
  padding: 0 20px 20px;
  display: flex;
  justify-content: center;
}

.no-more { color: var(--text-muted); font-size: 13px; }

.detail-loading { text-align: center; padding: 40px 0; color: var(--text-muted); }
</style>
