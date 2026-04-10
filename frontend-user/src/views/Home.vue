<template>
  <div class="home-page">
    <div class="container">
      <!-- 搜索结果模式 -->
      <template v-if="searchStore.isSearching">
        <div class="search-layout">
          <!-- 左侧筛选栏 -->
          <aside class="filter-sidebar">
            <!-- 价格范围滑块组件 - 基于搜索结果商品的价格范围 -->
            <PriceRangeSlider
              :min-price-limit="searchResultMinPrice"
              :max-price-limit="searchResultMaxPrice"
              v-model:current-min-price="searchStore.currentMinPrice"
              v-model:current-max-price="searchStore.currentMaxPrice"
              @change="handlePriceFilterChange"
            />
          </aside>

          <!-- 右侧搜索结果 -->
          <section class="search-result-section">
            <div class="search-header">
              <div class="search-info">
                <span>搜索 "</span>
                <span class="keyword">{{ searchStore.keyword }}</span>
                <span>" 的结果，共 {{ filteredSearchResults.length }} 件商品</span>
                <!-- 显示价格筛选条件 -->
                <span v-if="searchStore.hasPriceFilter" class="price-filter-tag">
                  <el-tag
                    closable
                    size="small"
                    @close="handleClearPriceFilter"
                  >
                    价格: ¥{{ formatPrice(searchStore.currentMinPrice) }} - ¥{{ formatPrice(searchStore.currentMaxPrice) }}
                  </el-tag>
                </span>
              </div>
              <el-button text @click="handleClearSearch">
                <el-icon><Close /></el-icon>
                清除搜索
              </el-button>
            </div>

            <div class="product-grid" v-if="filteredSearchResults.length > 0">
              <ProductCard
                v-for="product in filteredSearchResults"
                :key="product.id"
                :product="product"
              />
            </div>
            <el-empty v-else description="没有找到相关商品">
              <el-button type="primary" @click="handleClearSearch">
                返回首页
              </el-button>
            </el-empty>
          </section>
        </div>
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
import { computed } from 'vue'
import BannerCarousel from '@/components/BannerCarousel.vue'
import ProductCard from '@/components/ProductCard.vue'
import PriceRangeSlider from '@/components/PriceRangeSlider.vue'
import { recommendProducts, searchProducts } from '@/api'
import { useSearchStore } from '@/stores/search'
import { ElMessage } from 'element-plus'

// 获取搜索状态管理store
const searchStore = useSearchStore()

/**
 * 根据关键词筛选的原始搜索结果（不含价格筛选）
 * @returns {Array} 关键词筛选后的商品列表
 */
const keywordSearchResults = computed(() => {
  return searchProducts(searchStore.keyword, null, null)
})

/**
 * 计算搜索结果中的最低价格
 * @returns {number} 搜索结果中的最低价格
 */
const searchResultMinPrice = computed(() => {
  const products = keywordSearchResults.value
  if (products.length === 0) return 0
  return Math.min(...products.map(p => p.price))
})

/**
 * 计算搜索结果中的最高价格
 * @returns {number} 搜索结果中的最高价格
 */
const searchResultMaxPrice = computed(() => {
  const products = keywordSearchResults.value
  if (products.length === 0) return 10000
  return Math.max(...products.map(p => p.price))
})

/**
 * 根据关键词和价格筛选条件计算最终搜索结果
 * @returns {Array} 筛选后的商品列表
 */
const filteredSearchResults = computed(() => {
  return searchProducts(
    searchStore.keyword,
    searchStore.currentMinPrice,
    searchStore.currentMaxPrice
  )
})

/**
 * 格式化价格显示，超过10000显示为万
 * @param {number} value - 价格值
 * @returns {string} 格式化后的价格字符串
 */
function formatPrice(value) {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + '万'
  }
  return value.toString()
}

/**
 * 处理价格筛选变化
 * @param {Object} priceRange - 价格范围对象
 * @param {number} priceRange.minPrice - 最低价格
 * @param {number} priceRange.maxPrice - 最高价格
 */
function handlePriceFilterChange(priceRange) {
  searchStore.setPriceFilter(priceRange.minPrice, priceRange.maxPrice)
}

/**
 * 处理清除价格筛选
 */
function handleClearPriceFilter() {
  searchStore.clearPriceFilter()
  ElMessage.success('已清除价格筛选')
}

/**
 * 处理清除搜索（包括关键词和价格筛选）
 */
function handleClearSearch() {
  searchStore.clearSearch()
}
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 40px;
}

.banner-section {
  margin-bottom: 32px;
}

.recommend-section {
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

// 搜索结果布局
.search-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.filter-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
}

.search-result-section {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
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
    display: flex;
    align-items: center;
    gap: 8px;

    .keyword {
      color: #FF5000;
      font-weight: 600;
    }

    .price-filter-tag {
      margin-left: 8px;

      :deep(.el-tag) {
        background-color: #fff2e8;
        border-color: #ffbb96;
        color: #FF5000;
      }
    }
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

// 响应式布局
@media screen and (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 992px) {
  .search-layout {
    flex-direction: column;
  }

  .filter-sidebar {
    width: 100%;
    position: static;
  }
}

@media screen and (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .search-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .search-info {
      flex-wrap: wrap;
    }
  }
}

@media screen and (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
