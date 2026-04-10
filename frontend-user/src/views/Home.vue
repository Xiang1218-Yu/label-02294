<template>
  <div class="home-page">
    <div class="container">
      <!-- 搜索结果模式 -->
      <template v-if="searchStore.isSearching">
        <section class="search-result-section">
          <div class="search-header">
            <div class="search-info">
              <span>搜索 "</span>
              <span class="keyword">{{ searchStore.keyword }}</span>
              <span>" 的结果，共 {{ searchResults.length }} 件商品</span>
            </div>
            <el-button text @click="searchStore.clearSearch()">
              <el-icon><Close /></el-icon>
              清除搜索
            </el-button>
          </div>

          <!-- 价格范围过滤器 -->
          <div class="price-filter-section">
            <div class="filter-header">
              <span class="filter-label">价格范围：</span>
              <span class="price-display">¥{{ priceRange[0] }} - ¥{{ priceRange[1] }}</span>
            </div>
            <el-slider
              v-model="priceRange"
              :min="searchStore.minPrice"
              :max="searchStore.maxPrice"
              range
              show-input
              input-size="small"
              @change="handlePriceRangeChange"
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
            <el-button type="primary" @click="searchStore.clearSearch()">
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
import { computed, ref, onMounted, watch } from 'vue'
import BannerCarousel from '@/components/BannerCarousel.vue'
import ProductCard from '@/components/ProductCard.vue'
import { recommendProducts, searchProducts } from '@/api'
import { useSearchStore } from '@/stores/search'

const searchStore = useSearchStore()

// 价格范围双向绑定
const priceRange = ref([searchStore.minPrice, searchStore.maxPrice])

// 初始化价格范围
onMounted(() => {
  searchStore.initPriceRange()
  priceRange.value = [searchStore.minPrice, searchStore.maxPrice]
})

// 监听搜索状态，当进入搜索模式时初始化价格范围
watch(
  () => searchStore.isSearching,
  (newVal) => {
    if (newVal) {
      searchStore.initPriceRange()
      priceRange.value = [searchStore.minPrice, searchStore.maxPrice]
    }
  },
  { immediate: true }
)

// 处理价格范围变化
function handlePriceRangeChange(val) {
  searchStore.setPriceRange(val[0], val[1])
}

// 根据关键词和价格范围计算过滤后的搜索结果
const searchResults = computed(() => {
  return searchProducts(
    searchStore.keyword,
    searchStore.selectedMinPrice,
    searchStore.selectedMaxPrice
  )
})
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

// 价格范围过滤器样式
.price-filter-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .filter-label {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .price-display {
      font-size: 15px;
      color: #FF5000;
      font-weight: 600;
      background: #fff5f0;
      padding: 4px 12px;
      border-radius: 4px;
    }
  }

  .el-slider {
    .el-slider__runway {
      background: #ddd;
    }
    .el-slider__bar {
      background: #FF5000;
    }
    .el-slider__button {
      border-color: #FF5000;
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
