<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <div class="brand-section">
      <div class="brand-content">
        <div class="logo-wrapper">
          <img src="/logo.svg" alt="趣聚平台" class="logo-icon" />
          <h1 class="brand-title">趣聚平台</h1>
        </div>
        <p class="brand-subtitle">发现有趣活动，结识志趣相投的人</p>
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            </span>
            <span>创建与发布丰富多彩的线下活动</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            </span>
            <span>按兴趣探索附近精彩活动</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            </span>
            <span>构建兴趣小队，与同好一起成长</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录区 -->
    <div class="login-section">
      <div class="login-card">
        <div class="card-header">
          <h2 class="card-title">管理员登录</h2>
          <p class="card-desc">欢迎回来，请登录管理后台</p>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-width="0"
          size="large"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="管理员邮箱"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" :loading="loading" @click="handleLogin" class="login-btn">
              {{ loading ? '登录中...' : '登 录' }}
            </el-button>
          </el-form-item>
        </el-form>

        <el-divider class="dev-divider">
          <span class="dev-label">开发模式</span>
        </el-divider>

        <el-button size="large" @click="handleDemoLogin" class="demo-btn">
          演示模式 · 直接进入后台
        </el-button>

        <p class="footer-note">仅管理员可登录，无注册入口</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import type { FormInstance, FormRules } from 'element-plus'

const authStore = useAuthStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
})

const loginRules: FormRules = {
  email: [
    { required: true, message: '请输入管理员邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱格式', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  const valid = await loginFormRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await authStore.login({
      email: loginForm.email,
      password: loginForm.password,
    })
    ElMessage.success('登录成功')
  } catch {
    // 错误已在拦截器中处理
  } finally {
    loading.value = false
  }
}

function handleDemoLogin() {
  authStore.demoLogin()
  ElMessage.success('已进入演示模式')
}
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #1a1a2e 30%, #16213e 55%, #0f3460 100%);
  position: relative;
  overflow: hidden;
}

/* 装饰光晕 */
.login-page::before {
  content: '';
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.07) 0%, transparent 70%);
  top: -250px;
  left: 30%;
  transform: translateX(-50%);
}

.login-page::after {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 242, 195, 0.05) 0%, transparent 70%);
  bottom: -150px;
  right: 10%;
}

/* ===== 左侧品牌区 ===== */
.brand-section {
  flex: 1.3;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.brand-content {
  position: relative;
  z-index: 1;
  padding: 60px;
  max-width: 520px;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}

.brand-title {
  font-size: 40px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 4px;
}

.brand-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 56px;
  line-height: 1.6;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 17px;
}

.feature-icon {
  color: #b2ebf2;
  display: flex;
  flex-shrink: 0;
}

/* ===== 右侧登录区 ===== */
.login-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 1;
}

.login-card {
  width: 380px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 36px 32px 28px;
}

.card-header {
  margin-bottom: 28px;
  text-align: center;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 6px;
}

.card-desc {
  font-size: 13px;
  color: #909399;
  margin: 0;
}

.login-btn {
  width: 100%;
  height: 42px;
  font-size: 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0f3460, #1a5276);
  border: none;
}

.login-btn:hover {
  background: linear-gradient(135deg, #1a5276, #2980b9);
}

.dev-divider {
  margin: 20px 0 14px;
}

.dev-label {
  color: #bbb;
  font-size: 11px;
}

.demo-btn {
  width: 100%;
  height: 40px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
  color: #909399;
  background: #fafafa;
}

.demo-btn:hover {
  border-color: #4fc3f7;
  color: #4fc3f7;
  background: #f0fbff;
}

.footer-note {
  text-align: center;
  color: #ccc;
  font-size: 11px;
  margin-top: 20px;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .brand-section {
    display: none;
  }

  .login-section {
    padding: 24px;
  }
}
</style>
