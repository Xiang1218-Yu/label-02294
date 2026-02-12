<template>
  <div class="product-page">
    <div class="container">
      <template v-if="product">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品详情</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 商品主信息 -->
        <div class="product-main">
          <div class="product-gallery">
            <div class="main-image">
              <img :src="product.image" :alt="product.name" />
            </div>
          </div>

          <div class="product-info">
            <h1 class="product-title">{{ product.name }}</h1>
            
            <div class="product-price-box">
              <div class="price-row">
                <span class="label">价格</span>
                <span class="current-price price">{{ product.price }}</span>
                <span class="original-price" v-if="product.originalPrice > product.price">
                  ¥{{ product.originalPrice }}
                </span>
                <el-tag type="danger" size="small" v-if="discount > 0">
                  {{ discount }}折
                </el-tag>
              </div>
              <div class="sales-row">
                <span>累计销量 {{ product.sales }} 件</span>
              </div>
            </div>

            <div class="product-attrs">
              <div class="attr-row">
                <span class="label">配送</span>
                <span class="value">
                  <el-icon><Location /></el-icon>
                  全国包邮
                </span>
              </div>
              <div class="attr-row">
                <span class="label">服务</span>
                <span class="value">
                  <el-tag size="small">7天无理由退换</el-tag>
                  <el-tag size="small">正品保障</el-tag>
                </span>
              </div>
              <div class="attr-row">
                <span class="label">店铺</span>
                <span class="value shop-name">{{ product.shop }}</span>
              </div>
            </div>

            <div class="product-actions">
              <el-button type="primary" size="large" @click="addToCart" :loading="adding">
                <el-icon><ShoppingCart /></el-icon>
                加入购物车
              </el-button>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <el-empty description="商品不存在">
          <el-button type="primary" @click="$router.push('/')">
            返回首页
          </el-button>
        </el-empty>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductById } from '@/api'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const cartStore = useCartStore()
const product = ref(null)
const adding = ref(false)

watch(
  () => route.params.id,
  (id) => {
    product.value = getProductById(id)
  },
  { immediate: true }
)

const discount = computed(() => {
  if (!product.value) return 0
  if (product.value.originalPrice > product.value.price) {
    return Math.round((product.value.price / product.value.originalPrice) * 10)
  }
  return 0
})

function addToCart() {
  adding.value = true
  setTimeout(() => {
    cartStore.addItem(product.value)
    ElMessage.success('已加入购物车')
    adding.value = false
  }, 300)
}
</script>

<style lang="scss" scoped>
.product-page {
  padding-bottom: 40px;
}

.breadcrumb {
  padding: 16px 0;
}

.product-main {
  display: flex;
  gap: 40px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.product-gallery {
  width: 400px;
  flex-shrink: 0;

  .main-image {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    background: #f5f5f5;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.product-info {
  flex: 1;
}

.product-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  line-height: 1.5;
  margin-bottom: 20px;
}

.product-price-box {
  background: #FFF4F0;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;

  .price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 12px;

    .label {
      font-size: 14px;
      color: #999;
    }

    .current-price {
      font-size: 28px;
    }

    .original-price {
      font-size: 14px;
      color: #999;
      text-decoration: line-through;
    }
  }

  .sales-row {
    font-size: 13px;
    color: #999;
  }
}

.product-attrs {
  .attr-row {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #eee;

    .label {
      width: 60px;
      font-size: 14px;
      color: #999;
      flex-shrink: 0;
    }

    .value {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #333;
    }

    .shop-name {
      color: #FF5000;
    }
  }
}

.product-actions {
  margin-top: 32px;

  .el-button {
    height: 48px;
    padding: 0 48px;
    font-size: 16px;
  }
}
</style>
