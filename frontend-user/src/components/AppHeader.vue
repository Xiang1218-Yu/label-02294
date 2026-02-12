<template>
  <header class="app-header">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="container top-bar-content">
        <div class="top-left">
          <span class="welcome">掏宝，淘你喜欢！</span>
          <template v-if="userStore.isLoggedIn">
            <el-dropdown @command="handleCommand" class="drop">
              <span class="user-info">
                <span class="nickname">{{ userStore.userInfo?.username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link to="/login" class="login-link">请登录</router-link>
          </template>
        </div>
        <div class="top-right">
          <div class="cart-btn" @click="handleCartClick">
            <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0" :max="99">
              <el-icon :size="18"><ShoppingCart /></el-icon>
            </el-badge>
            <span>购物车</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主导航栏 -->
    <div class="main-nav">
      <div class="container main-nav-content">
        <router-link to="/" class="logo">
          <span class="logo-text">掏宝</span>
        </router-link>
        
        <div class="search-box">
          <div class="search-input-wrapper">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索商品"
              size="large"
              :maxlength="50"
              @keyup.enter="handleSearch"
            />
            <el-button 
              type="primary" 
              size="large"
              class="search-btn"
              @click="handleSearch" 
              :loading="searching"
            >
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </div>
          <div class="hot-search">
            <span class="label">热门搜索：</span>
            <a 
              v-for="item in hotSearches.slice(0, 5)" 
              :key="item" 
              href="#"
              class="hot-item"
              @click.prevent="quickSearch(item)"
            >
              {{ item }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 购物车弹框 -->
    <el-drawer
      v-model="cartStore.visible"
      title="购物车"
      direction="rtl"
      size="400px"
    >
      <div class="cart-content">
        <template v-if="cartStore.items.length > 0">
          <div class="cart-list">
            <div class="cart-item" v-for="item in cartStore.items" :key="item.id">
              <img :src="item.image" :alt="item.name" class="cart-item-image" />
              <div class="cart-item-info">
                <div class="cart-item-name">{{ item.name }}</div>
                <div class="cart-item-price price">{{ item.price }}</div>
                <div class="cart-item-actions">
                  <el-input-number 
                    v-model="item.quantity" 
                    :min="1" 
                    :max="99" 
                    size="small"
                    @change="(val) => cartStore.updateQuantity(item.id, val)"
                  />
                  <el-button 
                    type="danger" 
                    text 
                    size="small"
                    @click="cartStore.removeItem(item.id)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-footer">
            <div class="cart-total">
              <span>共 {{ cartStore.totalCount }} 件商品</span>
              <span class="total-price">合计：<em class="price">{{ cartStore.totalPrice.toFixed(2) }}</em></span>
            </div>
          </div>
        </template>
        <template v-else>
          <el-empty description="购物车是空的">
            <el-button type="primary" @click="cartStore.hideCart(); $router.push('/')">
              去购物
            </el-button>
          </el-empty>
        </template>
      </div>
    </el-drawer>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useSearchStore } from '@/stores/search'
import { hotSearches } from '@/api'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const searchStore = useSearchStore()

const searchKeyword = ref('')
const searching = ref(false)
const maxSearchLength = 50

// 处理搜索关键词，过滤特殊字符
function sanitizeKeyword(keyword) {
  return keyword.replace(/[<>\"'&\\]/g, '').trim().slice(0, maxSearchLength)
}

function handleSearch() {
  const sanitized = sanitizeKeyword(searchKeyword.value)
  if (!sanitized) {
    ElMessage.warning('请输入有效的搜索关键词')
    return
  }
  if (sanitized.length < 2) {
    ElMessage.warning('搜索关键词至少2个字符')
    return
  }
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  searchKeyword.value = sanitized
  searchStore.setKeyword(sanitized)
  router.push('/')
}

function quickSearch(keyword) {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  const sanitized = sanitizeKeyword(keyword)
  searchKeyword.value = sanitized
  searchStore.setKeyword(sanitized)
  router.push('/')
}

function handleCommand(command) {
  if (command === 'logout') {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/')
  }
}

function handleCartClick() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  cartStore.showCart()
}
</script>

<style lang="scss" scoped>
.app-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.top-bar {
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  font-size: 12px;
  color: #666;
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;

  .welcome {
    color: #999;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    color: #333;
    height: 100%;

    &:hover {
      color: #FF5000;
    }

    .nickname {
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .login-link, .register-link {
    color: #FF5000;

    &:hover {
      text-decoration: underline;
    }
  }

  .divider {
    color: #ddd;
  }
}

.top-right {
  .cart-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 4px;
    transition: all 0.2s;

    :deep(.el-badge__content) {
      z-index: 10;
    }

    &:hover {
      background: #fff;
      color: #FF5000;
    }
  }
}

.main-nav {
  padding: 16px 0;
}

.main-nav-content {
  display: flex;
  align-items: center;
  gap: 40px;
  justify-content: center;
}

.logo {
  flex-shrink: 0;

  .logo-text {
    font-size: 36px;
    font-weight: bold;
    color: #FF5000;
    letter-spacing: 2px;
  }
}

.search-box {
  flex: 1;
  max-width: 600px;

  .search-input-wrapper {
    display: flex;
    align-items: stretch;

    :deep(.el-input) {
      flex: 1;

      .el-input__wrapper {
        border-radius: 4px 0 0 4px;
        border-color: #FF5000;
        box-shadow: 0 0 0 1px #FF5000 inset;
      }
    }

    .search-btn {
      border-radius: 0 4px 4px 0;
      padding: 0 24px;
      font-size: 16px;

      .el-icon {
        margin-right: 4px;
      }
    }
  }
}

.hot-search {
  margin-top: 8px;
  font-size: 12px;

  .label {
    color: #999;
  }

  .hot-item {
    color: #666;
    margin-left: 12px;

    &:hover {
      color: #FF5000;
    }
  }
}

// 购物车弹框样式
.cart-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cart-list {
  flex: 1;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;

  .cart-item-image {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    object-fit: cover;
  }

  .cart-item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .cart-item-name {
    font-size: 14px;
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .cart-item-price {
    font-size: 16px;
  }

  .cart-item-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.cart-footer {
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;

  .total-price {
    em {
      font-style: normal;
      font-size: 20px;
    }
  }
 
}
:deep(.el-dropdown) {
  margin-top: -2px;
}
</style>
