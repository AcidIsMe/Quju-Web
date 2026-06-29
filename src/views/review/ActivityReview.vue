<template>
  <div>
    <h2>活动审核</h2>
    <el-card class="table-card">
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="200" show-overflow-tooltip />
        <el-table-column prop="title" label="活动名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending_ai_review' ? 'warning' : 'warning'" size="small">
              {{ row.status === 'pending_ai_review' ? 'AI审核中' : '待人工审核' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发起人" width="130">
          <template #default="{ row }">{{ row.creator?.nickname }}</template>
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间" width="170" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row)">查看</el-button>
            <el-button type="success" link size="small" @click="handleApprove(row)">通过</el-button>
            <el-button type="warning" link size="small" @click="handleRequestChanges(row)">要求修改</el-button>
            <el-button type="danger" link size="small" @click="handleReject(row)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-button v-if="hasMore" :loading="loading" @click="loadMore">加载更多</el-button>
        <span v-else-if="list.length > 0" class="no-more">没有更多了</span>
      </div>
    </el-card>

    <!-- 审核对话框 -->
    <el-dialog v-model="reviewDialog.visible" :title="reviewDialog.title" width="500px">
      <div v-if="reviewDialog.activity" class="review-info">
        <h4>{{ reviewDialog.activity.title }}</h4>
        <p class="review-desc">{{ reviewDialog.activity.description }}</p>
      </div>
      <el-form ref="reviewFormRef" :model="reviewDialog" :rules="reviewRules">
        <el-form-item label="处理意见" prop="reason">
          <el-input
            v-model="reviewDialog.reason"
            type="textarea"
            :rows="3"
            :placeholder="reviewDialog.placeholder"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialog.visible = false">取消</el-button>
        <el-button
          :type="reviewDialog.action === 'approve' ? 'success' : 'danger'"
          :loading="submitting"
          @click="confirmReview"
        >确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getActivityList, reviewActivity } from '@/api/modules/activity'
import type { ActivityItem } from '@/api/modules/activity'
import type { FormInstance } from 'element-plus'

const loading = ref(false)
const submitting = ref(false)
const list = ref<ActivityItem[]>([])
const cursor = ref<string | undefined>(undefined)
const hasMore = ref(false)

const reviewFormRef = ref<FormInstance>()
const reviewRules = {
  reason: [{ required: true, message: '请填写处理原因', trigger: 'blur' }],
}

const reviewDialog = reactive({
  visible: false,
  title: '',
  action: '' as 'approve' | 'reject' | 'request_changes',
  reason: '',
  placeholder: '',
  activity: null as ActivityItem | null,
  targetId: '',
})

async function fetchList() {
  loading.value = true
  cursor.value = undefined
  try {
    const res = await getActivityList({
      status: 'pending_manual_review',
      limit: 10,
    })
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
    const res = await getActivityList({
      status: 'pending_manual_review',
      cursor: cursor.value,
      limit: 10,
    })
    list.value = [...list.value, ...res.data.list]
    hasMore.value = res.data.pagination.has_more
    cursor.value = res.data.pagination.next_cursor || undefined
  } finally {
    loading.value = false
  }
}

function viewDetail(row: ActivityItem) {
  reviewDialog.activity = row
  ElMessage.info('详情查看待实现')
}

function handleApprove(row: ActivityItem) {
  reviewDialog.visible = true
  reviewDialog.targetId = row.id
  reviewDialog.action = 'approve'
  reviewDialog.title = '审核通过'
  reviewDialog.reason = ''
  reviewDialog.placeholder = ''
}

function handleReject(row: ActivityItem) {
  reviewDialog.visible = true
  reviewDialog.targetId = row.id
  reviewDialog.action = 'reject'
  reviewDialog.title = '驳回活动'
  reviewDialog.reason = ''
  reviewDialog.placeholder = '请填写驳回原因'
}

function handleRequestChanges(row: ActivityItem) {
  reviewDialog.visible = true
  reviewDialog.targetId = row.id
  reviewDialog.action = 'request_changes'
  reviewDialog.title = '要求修改'
  reviewDialog.reason = ''
  reviewDialog.placeholder = '请填写修改意见'
}

async function confirmReview() {
  if (reviewDialog.action !== 'approve') {
    const valid = await reviewFormRef.value?.validate().catch(() => false)
    if (!valid) return
  }
  submitting.value = true
  try {
    await reviewActivity({
      id: reviewDialog.targetId,
      action: reviewDialog.action,
      reason: reviewDialog.action !== 'approve' ? reviewDialog.reason : undefined,
    })
    ElMessage.success('审核完成')
    reviewDialog.visible = false
    fetchList()
  } finally {
    submitting.value = false
  }
}

onMounted(fetchList)
</script>

<style scoped>
h2 { margin-bottom: 16px; color: #333; }
.table-card { min-height: 400px; }
.pagination-wrapper { margin-top: 16px; display: flex; justify-content: center; }
.no-more { color: #999; font-size: 13px; }
.review-info { margin-bottom: 16px; padding: 12px; background: #f5f7fa; border-radius: 6px; }
.review-info h4 { margin: 0 0 8px; color: #333; }
.review-desc { font-size: 13px; color: #666; margin: 0; }
</style>
