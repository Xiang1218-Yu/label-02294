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
              <span>" 的结果，共 {{ productsByKeyword.length }} 件商品</span>
            </div>
            <el-button text @click="searchStore.clearSearch(); resetPriceRange()">
              <el-icon><Close /></el-icon>
              清除搜索
            </el-button>
          </div>

          <!-- 价格筛选区域 - 使用搜索后商品的价格范围 -->
          <div class="price-filter-section" v-if="productsByKeyword.length > 0">
            <div class="filter-title">
              <span>价格范围（¥{{ dynamicMinPrice }} - ¥{{ dynamicMaxPrice }}）</span>
              <el-button
                v-if="hasPriceFilter"
                type="danger"
                link
                size="small"
                @click="resetPriceRange"
              >
                重置
              </el-button>
            </div>
            <el-slider
              v-model="priceRangeValue"
              :min="dynamicMinPrice"
              :max="dynamicMaxPrice"
              range
              :format-tooltip="priceFormat"
              show-input
              input-size="small"
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
            <el-button type="primary" @click="searchStore.clearSearch(); resetPriceRange()">
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

          <!-- 价格筛选区域 -->
          <div class="price-filter-section">
            <div class="filter-title">
              <span>价格范围（¥{{ dynamicMinPrice }} - ¥{{ dynamicMaxPrice }}）</span>
              <el-button
                v-if="hasPriceFilter"
                type="danger"
                link
                size="small"
                @click="resetPriceRange"
              >
                重置
              </el-button>
            </div>
            <el-slider
              v-model="priceRangeValue"
              :min="dynamicMinPrice"
              :max="dynamicMaxPrice"
              range
              :format-tooltip="priceFormat"
              show-input
              input-size="small"
              class="price-slider"
            />
          </div>
          
          <div class="product-grid">
            <ProductCard 
              v-for="product in filteredRecommendProducts" 
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
import { recommendProducts, searchProducts, filterProductsByPrice, getPriceRange, getPriceRangeFromProducts } from '@/api'
import { useSearchStore } from '@/stores/search'

const searchStore = useSearchStore()

// 价格范围 - 用户选择的筛选值
const priceRangeValue = ref([0, 99999])

// 动态价格范围边界值 - 根据当前商品列表计算得出
const dynamicMinPrice = ref(0)
const dynamicMaxPrice = ref(99999)

// 初始化所有商品的价格范围
const initRange = getPriceRange()
dynamicMinPrice.value = initRange.minPrice
dynamicMaxPrice.value = initRange.maxPrice
priceRangeValue.value = [initRange.minPrice, initRange.maxPrice]

/**
 * 重置价格范围到全部
 */
function resetPriceRange() {
  priceRangeValue.value = [dynamicMinPrice.value, dynamicMaxPrice.value]
}

/**
 * 判断是否有激活的价格筛选
 */
const hasPriceFilter = computed(() => {
  return (
    priceRangeValue.value[0] !== dynamicMinPrice.value ||
    priceRangeValue.value[1] !== dynamicMaxPrice.value
  )
})

/**
 * 价格格式化显示
 */
const priceFormat = (value) => {
  return `¥${value}`
}

// 根据关键词搜索的商品（未筛选价格前）
const productsByKeyword = computed(() => {
  return searchProducts(searchStore.keyword)
})

// 监听搜索关键词变化 - 动态调整滑块范围为搜索后商品的价格范围
watch(
  () => searchStore.keyword,
  () => {
    if (searchStore.isSearching) {
      // 根据搜索后的商品计算价格范围
      const searchedProducts = searchProducts(searchStore.keyword)
      if (searchedProducts.length > 0) {
        const range = getPriceRangeFromProducts(searchedProducts)
        dynamicMinPrice.value = range.minPrice
        dynamicMaxPrice.value = range.maxPrice
        // 默认价格范围设置为全部
        priceRangeValue.value = [range.minPrice, range.maxPrice]
      }
    } else {
      // 恢复为全部商品的价格范围
      const allRange = getPriceRange()
      dynamicMinPrice.value = allRange.minPrice
      dynamicMaxPrice.value = allRange.maxPrice
      priceRangeValue.value = [allRange.minPrice, allRange.maxPrice]
    }
  },
  { immediate: true }
)

// 最终搜索结果商品
const searchResults = computed(() => {
  return filterProductsByPrice(
    productsByKeyword.value,
    priceRangeValue.value[0],
    priceRangeValue.value[1]
  )
})

// 好物推荐商品（价格筛选后）
const filteredRecommendProducts = computed(() => {
  return filterProductsByPrice(
    recommendProducts,
    priceRangeValue.value[0],
    priceRangeValue.value[1]
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

// 价格筛选区域样式
.price-filter-section {
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff5f0 0%, #fffbf8 100%);
  border: 1px solid #ffe8d6;
  border-radius: 12px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #FF5000, #FF8A2B);
  }

  .filter-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-size: 15px;
    font-weight: 600;
    color: #333;

    span:first-child {
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: '¥';
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #FF5000, #FF8A2B);
        color: #fff;
        border-radius: 6px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  :deep(.price-slider) {
    padding: 0 8px;

    .el-slider__runway {
      height: 6px;
      background: #ffdfc9;
      border-radius: 3px;
    }

    .el-slider__bar {
      height: 6px;
      background: linear-gradient(90deg, #FF5000, #FF8A2B);
      border-radius: 3px;
    }

    .el-slider__button {
      width: 18px;
      height: 18px;
      border: 3px solid #fff;
      box-shadow: 0 2px 8px rgba(255, 80, 0, 0.4);
      background: linear-gradient(135deg, #FF5000, #FF8A2B);
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(255, 80, 0, 0.5);
      }
    }

    .el-slider__marks-text {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }

    .el-slider__input {
      width: 130px;

      .el-input__inner {
        height: 36px;
        border-radius: 8px;
        border: 1px solid #ffdfc9;
        background: #fff;
        color: #333;
        font-size: 13px;
        text-align: center;

        &:focus {
          border-color: #FF5000;
          box-shadow: 0 0 0 3px rgba(255, 80, 0, 0.1);
        }
      }

      .el-input-group__prepend,
      .el-input-group__append {
        background: #fff8f2;
        border-color: #ffdfc9;
        color: #FF5000;
        font-weight: 500;
      }
    }

    .el-slider__stop {
      background-color: #ffdfc9;
    }
  }
}

// 价格筛选区域响应式
@media screen and (max-width: 768px) {
  .price-filter-section {
    padding: 16px 16px 16px 20px;
    margin-bottom: 16px;
    border-radius: 10px;

    .filter-title {
      margin-bottom: 12px;
      font-size: 14px;
      flex-wrap: wrap;
      gap: 8px;

      span:first-child::before {
        width: 22px;
        height: 22px;
        font-size: 13px;
      }
    }

    :deep(.price-slider) {
      .el-slider__input {
        width: 110px;

        .el-input__inner {
          height: 32px;
          font-size: 12px;
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .price-filter-section {
    padding: 14px 14px 14px 18px;
    margin-bottom: 12px;

    .filter-title {
      font-size: 13px;
    }

    :deep(.price-slider) {
      .el-slider__button {
        width: 16px;
        height: 16px;
      }

      .el-slider__input {
        width: 95px;
      }
    }
  }
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