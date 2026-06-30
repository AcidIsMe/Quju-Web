<template>
  <div class="page-container">
    <!-- 页头 -->
    <div class="page-header">
      <div>
        <h2 class="page-title">商家审核</h2>
        <p class="page-desc">审核商家入驻申请，通过或驳回商家资质</p>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-card">
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="200" show-overflow-tooltip />
        <el-table-column prop="merchant_name" label="商家名称" min-width="160" />
        <el-table-column label="邮箱" width="200">
          <template #default="{ row }">{{ row.email || '—' }}</template>
        </el-table-column>
        <el-table-column label="营业凭证" width="100">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewLicense(row.license_image_url)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.audit_status === 'pending' ? 'warning' : row.audit_status === 'approved' ? 'success' : 'danger'"
              effect="plain" round size="small">
              {{ row.audit_status === 'pending' ? '待审核' : row.audit_status === 'approved' ? '已通过' : '已驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <template v-if="row.audit_status === 'pending'">
              <el-button type="success" link size="small" @click="handleApprove(row)">通过</el-button>
              <el-button type="danger" link size="small" @click="handleReject(row)">驳回</el-button>
            </template>
            <span v-else class="handled-label">已处理</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-button v-if="hasMore" :loading="loading" @click="loadMore" round>加载更多</el-button>
        <span v-else-if="list.length > 0" class="no-more">没有更多了</span>
      </div>
    </div>

    <!-- 驳回对话框 -->
    <el-dialog v-model="rejectDialog.visible" title="驳回商家申请" width="420px">
      <el-form ref="rejectFormRef" :model="rejectDialog" :rules="rejectRules">
        <el-form-item label="驳回原因" prop="reason">
          <el-input v-model="rejectDialog.reason" type="textarea" :rows="3" placeholder="请填写驳回原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialog.visible = false">取消</el-button>
        <el-button type="danger" :loading="submitting" @click="confirmReject">确认驳回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMerchantPendingList, approveMerchant, rejectMerchant } from '@/api/modules/merchant'
import type { MerchantItem } from '@/api/modules/merchant'
import type { FormInstance } from 'element-plus'

const loading = ref(false)
const submitting = ref(false)
const list = ref<MerchantItem[]>([])
const hasMore = ref(false)

const rejectFormRef = ref<FormInstance>()
const rejectDialog = reactive({
  visible: false,
  reason: '',
  targetId: '',
})
const rejectRules = {
  reason: [{ required: true, message: '请填写驳回原因', trigger: 'blur' }],
}

async function fetchList() {
  loading.value = true
  try {
    const res = await getMerchantPendingList({ limit: 50 })
    const dataList = Array.isArray(res.data) ? res.data : (res.data?.list || [])
    list.value = dataList
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

function viewLicense(url: string) {
  window.open(url, '_blank')
}

function handleApprove(row: MerchantItem) {
  ElMessageBox.confirm('确认通过该商家申请？', '提示').then(async () => {
    await approveMerchant(row.id)
    ElMessage.success('商家审核已通过')
    fetchList()
  }).catch(() => {})
}

function handleReject(row: MerchantItem) {
  rejectDialog.visible = true
  rejectDialog.targetId = row.id
  rejectDialog.reason = ''
}

async function confirmReject() {
  const valid = await rejectFormRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await rejectMerchant(rejectDialog.targetId, rejectDialog.reason)
    ElMessage.success('已驳回商家申请')
    rejectDialog.visible = false
    fetchList()
  } finally {
    submitting.value = false
  }
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

.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  overflow: hidden;
  min-height: 400px;
}

.table-card :deep(.el-table) { border: none; }

.pagination-wrapper {
  margin-top: 16px;
  padding: 0 20px 20px;
  display: flex;
  justify-content: center;
}

.no-more { color: var(--text-muted); font-size: 13px; }

.handled-label { color: var(--text-muted); font-size: 12px; }
</style>
