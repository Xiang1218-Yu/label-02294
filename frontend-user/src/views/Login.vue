<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="bg-shape bg-shape-1"></div>
      <div class="bg-shape bg-shape-2"></div>
      <div class="bg-shape bg-shape-3"></div>
    </div>
    <div class="login-container">
      <div class="login-left">
        <div class="brand-info">
          <h1 class="brand-logo">掏宝</h1>
          <p class="brand-slogan">淘你喜欢，万千好物等你来</p>
          <div class="brand-features">
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>正品保障</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>极速物流</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>无忧售后</span>
            </div>
          </div>
        </div>
      </div>
      <div class="login-right">
        <div class="login-box">
          <div class="login-header">
            <h2>账号登录</h2>
            <router-link to="/" class="back-home">
              <el-icon><HomeFilled /></el-icon>
              返回首页
            </router-link>
          </div>

          <el-form 
            ref="formRef"
            :model="form" 
            :rules="rules" 
            label-position="top"
            @submit.prevent="handleLogin"
          >
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="form.username" 
                placeholder="请输入用户名"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="form.password" 
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                size="large"
                show-password
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                :loading="loading"
                @click="handleLogin"
                class="login-btn"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

async function handleLogin() {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    await userStore.login(form.username, form.password)
    ElMessage.success('登录成功')
    
    // 跳转到之前的页面或首页
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FF5000 0%, #FF8C00 50%, #FFB347 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: #fff;
}

.bg-shape-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.bg-shape-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -100px;
  animation: float 6s ease-in-out infinite reverse;
}

.bg-shape-3 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 20%;
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(5deg);
  }
}

.login-container {
  display: flex;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.login-left {
  width: 400px;
  background: linear-gradient(135deg, #FF6A26 0%, #FF5000 100%);
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 50%);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
  }
}

.brand-info {
  text-align: center;
  color: #fff;
  position: relative;
  z-index: 1;
}

.brand-logo {
  font-size: 56px;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  color: #fff;
}

.brand-slogan {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 40px;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;

  .el-icon {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    padding: 4px;
    color: #fff;
  }
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  background: #fff;
}

.login-box {
  width: 100%;
  max-width: 340px;
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h2 {
    font-size: 26px;
    color: #333;
    font-weight: 600;
  }

  .back-home {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #666;

    &:hover {
      color: #FF5000;
    }
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
}
</style>
