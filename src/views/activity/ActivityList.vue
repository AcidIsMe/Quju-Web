<template>
  <div>
    <h2>活动管理</h2>
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
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
    </el-card>

    <el-card class="table-card">
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="200" show-overflow-tooltip />
        <el-table-column prop="title" label="活动名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.type" size="small">
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
        <el-button
          v-if="hasMore"
          :loading="loading"
          @click="loadMore"
        >加载更多</el-button>
        <span v-else-if="list.length > 0" class="no-more">没有更多了</span>
      </div>
    </el-card>

    <!-- 下架对话框 -->
    <el-dialog v-model="dialog.visible" title="下架活动" width="400px">
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
import { getActivityList, takeDownActivity, restoreActivity } from '@/api/modules/activity'
import type { ActivityItem } from '@/api/modules/activity'
import type { FormInstance } from 'element-plus'

const loading = ref(false)
const submitting = ref(false)
const list = ref<ActivityItem[]>([])
const cursor = ref<string | undefined>(undefined)
const hasMore = ref(false)

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

async function fetchList() {
  loading.value = true
  cursor.value = undefined
  try {
    const params: any = { limit: 10 }
    if (queryParams.q) params.q = queryParams.q
    if (queryParams.status) params.status = queryParams.status
    const res = await getActivityList(params)
    list.value = res.data.list
    hasMore.value = res.data.pagination.has_more
    cursor.value = res.data.pagination.next_cursor || undefined
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (!hasMore.value || loading.value) return
  loading.value = true
  try {
    const params: any = { cursor: cursor.value, limit: 10 }
    if (queryParams.q) params.q = queryParams.q
    if (queryParams.status) params.status = queryParams.status
    const res = await getActivityList(params)
    list.value = [...list.value, ...res.data.list]
    hasMore.value = res.data.pagination.has_more
    cursor.value = res.data.pagination.next_cursor || undefined
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  queryParams.q = ''
  queryParams.status = ''
  fetchList()
}

function viewDetail(id: string) {
  ElMessage.info('详情页待实现')
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
h2 { margin-bottom: 16px; color: #333; }
.search-card { margin-bottom: 16px; }
.table-card { min-height: 400px; }
.pagination-wrapper { margin-top: 16px; display: flex; justify-content: center; }
.no-more { color: #999; font-size: 13px; }
</style>
