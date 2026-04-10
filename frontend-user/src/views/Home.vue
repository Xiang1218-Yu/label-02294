<template>
  <div class="home-page">
    <div class="container">
      <!-- 搜索结果模式 -->
      <template v-if="searchStore.isSearching || hasPriceFilter">
        <section class="search-result-section">
          <div class="search-header">
            <div class="search-info">
              <template v-if="searchStore.keyword">
                <span>搜索 "</span>
                <span class="keyword">{{ searchStore.keyword }}</span>
                <span>" 的结果，共 {{ searchResults.length }} 件商品</span>
              </template>
              <template v-else>
                <span>价格筛选结果，共 {{ searchResults.length }} 件商品</span>
              </template>
            </div>
            <el-button text @click="clearAllFilters">
              <el-icon><Close /></el-icon>
              清除所有筛选
            </el-button>
          </div>

          <!-- 价格筛选区域 -->
          <div class="price-filter-section">
            <div class="price-filter-header">
              <span class="filter-label">价格区间</span>
              <span class="price-display">
                ¥{{ currentMinPrice }} - ¥{{ currentMaxPrice }}
              </span>
              <el-button 
                v-if="hasPriceFilter" 
                type="danger" 
                size="small" 
                link 
                @click="searchStore.resetPriceRange"
              >
                重置价格
              </el-button>
            </div>
            <el-slider
              v-model="priceRangeValue"
              :min="searchStore.minProductPrice"
              :max="searchStore.maxProductPrice"
              range
              show-input
              input-size="small"
              :format-tooltip="formatPrice"
              class="price-slider"
            />
          </div>
          
          <div class="product-grid" v-if="searchResults.length > 0">
            <ProductCard 
              v-for="product in searchResults" 
              :key="product.id" 
              :product="product" 
            />
          </div>
          <el-empty v-else description="没有找到相关商品">
            <el-button type="primary" @click="clearAllFilters">
              返回首页
            </el-button>
          </el-empty>
        </section>
      </template>

      <!-- 首页模式 -->
      <template v-else>
        <!-- 轮播图区域 -->
        <section class="banner-section">
          <BannerCarousel />
        </section>

        <!-- 推荐商品区域 -->
        <section class="recommend-section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Star /></el-icon>
              好物推荐
            </h2>
          </div>
          
          <div class="product-grid">
            <ProductCard 
              v-for="product in recommendProducts" 
              :key="product.id" 
              :product="product" 
            />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BannerCarousel from '@/components/BannerCarousel.vue'
import ProductCard from '@/components/ProductCard.vue'
import { recommendProducts, searchProducts } from '@/api'
import { useSearchStore } from '@/stores/search'

const searchStore = useSearchStore()

// 本地价格滑块绑定值 - 初始化时使用全局价格范围
const priceRangeValue = ref([searchStore.minProductPrice, searchStore.maxProductPrice])

// 监听store中的价格范围变化，同步本地滑块值
watch(
  () => searchStore.priceRange,
  (newRange) => {
    if (newRange[0] === null && newRange[1] === null) {
      priceRangeValue.value = [searchStore.minProductPrice, searchStore.maxProductPrice]
    }
  },
  { deep: true }
)

// 监听本地滑块值变化，更新store中的价格范围
watch(
  priceRangeValue,
  (newVal) => {
    searchStore.setPriceRange([...newVal])
  },
  { deep: true }
)

// 当前选择的最低价格（显示用）
const currentMinPrice = computed(() => {
  return priceRangeValue.value[0] ?? searchStore.minProductPrice
})

// 当前选择的最高价格（显示用）
const currentMaxPrice = computed(() => {
  return priceRangeValue.value[1] ?? searchStore.maxProductPrice
})

// 计算是否进入筛选模式：只要有关键词或者有价格筛选就显示
const hasPriceFilter = computed(() => {
  const range = searchStore.priceRange
  // 如果价格范围未初始化（都是null），说明还没有用户交互
  if (range[0] === null && range[1] === null) return false
  // 判断是否和极值不同（用户实际调整了滑块）
  const isMinDifferent = range[0] !== searchStore.minProductPrice
  const isMaxDifferent = range[1] !== searchStore.maxProductPrice
  return isMinDifferent || isMaxDifferent
})

// 根据关键词和价格范围筛选商品
const searchResults = computed(() => {
  // 1. 先根据关键词搜索
  let results = searchProducts(searchStore.keyword)
  
  // 2. 再根据价格范围筛选
  const [minPrice, maxPrice] = searchStore.priceRange
  if (minPrice !== null && maxPrice !== null) {
    results = results.filter(
      product => product.price >= minPrice && product.price <= maxPrice
    )
  }
  
  return results
})

// 清除所有筛选条件
function clearAllFilters() {
  // 先重置价格范围（会触发watch重置本地滑块值）
  searchStore.clearAllFilters()
}

// 格式化价格显示
function formatPrice(value) {
  return `¥${value}`
}
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 40px;
}

.banner-section {
  margin-bottom: 32px;
}

.recommend-section,
.search-result-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #FF5000;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #333;

  .el-icon {
    color: #FF5000;
  }
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;

  .search-info {
    font-size: 16px;
    color: #666;

    .keyword {
      color: #FF5000;
      font-weight: 600;
    }
  }
}

// 价格筛选区域样式
.price-filter-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 24px;

  .price-filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .filter-label {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .price-display {
      font-size: 14px;
      color: #FF5000;
      font-weight: 500;
    }
  }

  :deep(.price-slider) {
    .el-slider__input {
      width: 120px;
    }
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

// 响应式商品网格
@media screen and (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media screen and (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
