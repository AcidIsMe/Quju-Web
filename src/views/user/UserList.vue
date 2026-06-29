<template>
  <div>
    <h2>用户管理</h2>
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.q" placeholder="邮箱或昵称" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryParams.role" placeholder="全部" clearable style="width: 130px">
            <el-option label="个人用户" value="personal" />
            <el-option label="商家用户" value="merchant" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 130px">
            <el-option label="已激活" value="active" />
            <el-option label="已封禁" value="banned" />
            <el-option label="待激活" value="pending_activation" />
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
        <el-table-column prop="nickname" label="昵称" width="130" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column label="类型" width="90">
          <template #default="{ row }">
            <el-tag v-if="row.role === 'merchant'" type="warning" size="small">商家</el-tag>
            <el-tag v-else-if="row.role === 'admin'" type="danger" size="small">管理员</el-tag>
            <el-tag v-else type="primary" size="small">个人</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'active' ? 'success' : row.status === 'banned' ? 'danger' : 'warning'"
              size="small"
            >
              {{ row.status === 'active' ? '正常' : row.status === 'banned' ? '已封禁' : '待激活' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="credit_score" label="信誉分" width="80" align="center" />
        <el-table-column prop="created_at" label="注册时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row)">详情</el-button>
            <el-button
              v-if="row.status === 'active'"
              type="danger"
              link
              size="small"
              @click="handleBan(row)"
            >封禁</el-button>
            <el-button
              v-if="row.status === 'banned'"
              type="success"
              link
              size="small"
              @click="handleUnban(row)"
            >解封</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-button v-if="hasMore" :loading="loading" @click="loadMore">加载更多</el-button>
        <span v-else-if="list.length > 0" class="no-more">没有更多了</span>
      </div>
    </el-card>

    <el-dialog v-model="banDialog.visible" title="封禁用户" width="420px">
      <el-form ref="banFormRef" :model="banDialog" :rules="banRules">
        <el-form-item label="封禁原因" prop="reason">
          <el-input v-model="banDialog.reason" type="textarea" :rows="3" placeholder="请填写封禁原因" />
        </el-form-item>
        <el-form-item label="封禁期限">
          <el-select v-model="banDialog.expiresAt" style="width: 100%">
            <el-option :value="7" label="7天" />
            <el-option :value="30" label="30天" />
            <el-option :value="365" label="1年" />
            <el-option :value="0" label="永久" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="banDialog.visible = false">取消</el-button>
        <el-button type="danger" :loading="submitting" @click="confirmBan">确认封禁</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, banUser, unbanUser } from '@/api/modules/user'
import type { UserItem } from '@/api/modules/user'
import type { FormInstance } from 'element-plus'

const loading = ref(false)
const submitting = ref(false)
const list = ref<UserItem[]>([])
const cursor = ref<string | undefined>(undefined)
const hasMore = ref(false)

const queryParams = reactive({
  q: '',
  role: '',
  status: '',
})

const banFormRef = ref<FormInstance>()
const banDialog = reactive({
  visible: false,
  reason: '',
  expiresAt: 7,
  targetId: '',
})
const banRules = {
  reason: [{ required: true, message: '请填写封禁原因', trigger: 'blur' }],
}

async function fetchList() {
  loading.value = true
  cursor.value = undefined
  try {
    const params: any = { limit: 10 }
    if (queryParams.q) params.q = queryParams.q
    if (queryParams.role) params.role = queryParams.role
    if (queryParams.status) params.status = queryParams.status
    const res = await getUserList(params)
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
    if (queryParams.role) params.role = queryParams.role
    if (queryParams.status) params.status = queryParams.status
    const res = await getUserList(params)
    list.value = [...list.value, ...res.data.list]
    hasMore.value = res.data.pagination.has_more
    cursor.value = res.data.pagination.next_cursor || undefined
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  queryParams.q = ''
  queryParams.role = ''
  queryParams.status = ''
  fetchList()
}

function viewDetail(row: UserItem) {
  ElMessage.info('详情页待实现')
}

function handleBan(row: UserItem) {
  banDialog.visible = true
  banDialog.targetId = row.id
  banDialog.reason = ''
  banDialog.expiresAt = 7
}

async function confirmBan() {
  const valid = await banFormRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    const banData: { reason: string; expires_at?: string } = { reason: banDialog.reason }
    if (banDialog.expiresAt > 0) {
      const date = new Date()
      date.setDate(date.getDate() + banDialog.expiresAt)
      banData.expires_at = date.toISOString()
    }
    await banUser(banDialog.targetId, banData)
    ElMessage.success('用户已封禁')
    banDialog.visible = false
    fetchList()
  } finally {
    submitting.value = false
  }
}

async function handleUnban(row: UserItem) {
  try {
    await ElMessageBox.confirm('确认解封该用户？解封后用户可正常登录和使用平台。', '提示')
    await unbanUser(row.id)
    ElMessage.success('用户已解封')
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
