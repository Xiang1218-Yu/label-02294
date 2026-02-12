import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // 模拟用户数据
  const mockUsers = [
    { id: 1, username: 'admin', password: '123456', nickname: '管理员', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    { id: 2, username: 'user', password: '123456', nickname: '普通用户', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }
  ]

  function login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.username === username && u.password === password)
        if (user) {
          const { password: _, ...userData } = user
          userInfo.value = userData
          token.value = `mock_token_${user.id}_${Date.now()}`
          localStorage.setItem('token', token.value)
          localStorage.setItem('userInfo', JSON.stringify(userData))
          resolve(userData)
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 500)
    })
  }

  function logout() {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  function initUser() {
    const savedUser = localStorage.getItem('userInfo')
    if (savedUser && token.value) {
      try {
        userInfo.value = JSON.parse(savedUser)
      } catch {
        logout()
      }
    }
  }

  // 初始化
  initUser()

  return {
    userInfo,
    token,
    isLoggedIn,
    login,
    logout
  }
})
