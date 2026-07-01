<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <div class="brand-section">
      <div class="brand-content">
        <div class="logo-wrapper">
          <img src="/logo.svg" alt="趣聚平台" class="logo-icon" />
          <h1 class="brand-title">趣聚平台</h1>
        </div>
        <p class="brand-subtitle">管理后台 · 发现有趣活动，结识志趣相投的人</p>
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            </span>
            <span>审核与发布丰富多彩的线下活动</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            </span>
            <span>管理用户与商家入驻申请</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            </span>
            <span>数据分析，掌控平台运营状态</span>
          </div>
        </div>
      </div>

      <!-- 装饰图形 -->
      <div class="brand-decoration">
        <div class="deco-circle deco-circle-1"></div>
        <div class="deco-circle deco-circle-2"></div>
        <div class="deco-circle deco-circle-3"></div>
      </div>
    </div>

    <!-- 右侧登录区 -->
    <div class="login-section">
      <div class="login-card">
        <div class="card-header">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="32" height="32">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 class="card-title">管理员登录</h2>
          <p class="card-desc">欢迎回来，请输入您的账户信息</p>
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

        <div class="divider-with-text">
          <span class="divider-line"></span>
          <span class="divider-text">快捷进入</span>
          <span class="divider-line"></span>
        </div>

      
        <p class="footer-note">仅管理员可登录</p>
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
  background: var(--bg-page);
  position: relative;
  overflow: hidden;
}

/* ===== 左侧品牌区 ===== */
.brand-section {
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(160deg, oklch(0.88 0.08 220 / 0.15), oklch(0.95 0.03 210 / 0.08));
  overflow: hidden;
}

.brand-content {
  position: relative;
  z-index: 2;
  padding: 60px;
  max-width: 480px;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.logo-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}

.brand-title {
  font-size: 34px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 3px;
}

.brand-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 48px;
  line-height: 1.6;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.5;
}

.feature-icon {
  color: var(--brand);
  display: flex;
  flex-shrink: 0;
}

/* === 装饰图形 === */
.brand-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
}

.deco-circle-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, oklch(0.78 0.12 220 / 0.12) 0%, transparent 70%);
  top: -120px;
  right: -80px;
}

.deco-circle-2 {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, oklch(0.88 0.08 70 / 0.1) 0%, transparent 70%);
  bottom: -60px;
  left: -60px;
}

.deco-circle-3 {
  width: 160px;
  height: 160px;
  border: 2px solid oklch(0.82 0.08 218 / 0.15);
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
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
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-md);
  padding: 40px 32px 32px;
}

.card-header {
  margin-bottom: 28px;
  text-align: center;
}

.card-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: oklch(0.93 0.04 220 / 0.3);
  color: var(--brand);
  border-radius: 14px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 6px;
}

.card-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  border-radius: 10px;
  letter-spacing: 2px;
}

/* Divider */
.divider-with-text {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 14px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--border-muted);
}

.divider-text {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.demo-btn {
  width: 100%;
  height: 42px;
  font-size: 13px;
  border-radius: 10px;
  border: 1px dashed var(--border-light);
  color: var(--text-secondary);
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.demo-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-bg);
}

.footer-note {
  text-align: center;
  color: var(--text-muted);
  font-size: 11px;
  margin-top: 18px;
}

@media (max-width: 768px) {
  .brand-section {
    display: none;
  }

  .login-section {
    padding: 24px;
  }
}
</style>
