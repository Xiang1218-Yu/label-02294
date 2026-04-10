<template>
  <div class="home-page">
    <div class="container">
      <!-- 搜索结果模式 -->
      <template v-if="searchStore.isSearching">
        <div class="search-layout">
          <!-- 左侧筛选侧边栏 -->
          <aside class="filter-sidebar">
            <div class="sidebar-sticky">
              <!-- 价格范围筛选区域 -->
              <div class="filter-card price-filter-card">
                <div class="filter-card-header">
                  <span class="filter-label">
                    <el-icon><Money /></el-icon>
                    价格范围
                  </span>
                  <el-button 
                    v-if="searchStore.selectedMinPrice > 0 || searchStore.selectedMaxPrice > 0"
                    link 
                    size="small" 
                    @click="resetPriceFilter"
                  >
                    重置
                  </el-button>
                </div>
                <div class="filter-card-body">
                  <el-slider
                    v-model="priceRangeValue"
                    range
                    :min="searchResultMinPrice"
                    :max="searchResultMaxPrice"
                    :step="1"
                    show-tooltip
                    :format-tooltip="(value) => '¥' + value"
                    @change="handlePriceRangeChange"
                  />
                  <div class="price-input-group">
                    <div class="price-input-wrapper">
                      <span class="price-prefix">¥</span>
                      <el-input-number
                        v-model="priceRangeValue[0]"
                        :min="searchResultMinPrice"
                        :max="searchResultMaxPrice"
                        :step="1"
                        size="small"
                        class="price-input"
                        @change="syncPriceRange"
                      />
                    </div>
                    <span class="price-separator">-</span>
                    <div class="price-input-wrapper">
                      <span class="price-prefix">¥</span>
                      <el-input-number
                        v-model="priceRangeValue[1]"
                        :min="searchResultMinPrice"
                        :max="searchResultMaxPrice"
                        :step="1"
                        size="small"
                        class="price-input"
                        @change="syncPriceRange"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- 右侧搜索结果区域 -->
          <main class="search-main-content">
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
          </main>
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
import { computed, ref, watch } from 'vue'
import { Money } from '@element-plus/icons-vue'
import BannerCarousel from '@/components/BannerCarousel.vue'
import ProductCard from '@/components/ProductCard.vue'
import { recommendProducts, searchProducts, getMinPrice, getMaxPrice } from '@/api'
import { useSearchStore } from '@/stores/search'

const searchStore = useSearchStore()

// 全局商品价格范围（所有商品中的最低和最高价格）
const globalMinPrice = ref(getMinPrice())
const globalMaxPrice = ref(getMaxPrice())

// 滑块绑定值
const priceRangeValue = ref([globalMinPrice.value, globalMaxPrice.value])

// 不使用价格过滤的搜索结果（用于计算动态价格区间）
const searchResultsWithoutPriceFilter = computed(() => {
  return searchProducts(searchStore.keyword, 0, 0)
})

// 搜索结果商品的动态最低价格
const searchResultMinPrice = computed(() => {
  if (searchResultsWithoutPriceFilter.value.length === 0) return globalMinPrice.value
  return getMinPrice(searchResultsWithoutPriceFilter.value)
})

// 搜索结果商品的动态最高价格
const searchResultMaxPrice = computed(() => {
  if (searchResultsWithoutPriceFilter.value.length === 0) return globalMaxPrice.value
  return getMaxPrice(searchResultsWithoutPriceFilter.value)
})

// 搜索结果 - 结合关键词和价格范围过滤（最终显示结果）
const searchResults = computed(() => {
  return searchProducts(
    searchStore.keyword,
    searchStore.selectedMinPrice,
    searchStore.selectedMaxPrice
  )
})

// 监听搜索关键词变化，重置价格范围
watch(searchResultsWithoutPriceFilter, (newResults) => {
  if (newResults.length > 0) {
    const newMin = getMinPrice(newResults)
    const newMax = getMaxPrice(newResults)
    priceRangeValue.value = [newMin, newMax]
    searchStore.resetPriceRange()
  }
}, { immediate: true })

// 同步价格范围到store
function syncPriceRange() {
  searchStore.setPriceRange(priceRangeValue.value[0], priceRangeValue.value[1])
}

// 处理价格范围滑块变化
function handlePriceRangeChange(values) {
  const [min, max] = values
  searchStore.setPriceRange(min, max)
}

// 重置价格筛选
function resetPriceFilter() {
  priceRangeValue.value = [searchResultMinPrice.value, searchResultMaxPrice.value]
  searchStore.resetPriceRange()
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

.search-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.filter-sidebar {
  width: 280px;
  flex-shrink: 0;

  .sidebar-sticky {
    position: sticky;
    top: 24px;
  }
}

.search-main-content {
  flex: 1;
  min-width: 0;
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

    .keyword {
      color: #FF5000;
      font-weight: 600;
    }
  }
}

.filter-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, #fff5f0 0%, #fff 100%);
    border-bottom: 1px solid #ffede0;

    .filter-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #333;

      .el-icon {
        font-size: 20px;
        color: #FF5000;
      }
    }

    .el-button {
      font-size: 13px;
      padding: 4px 0;
    }
  }

  &-body {
    padding: 20px;

    .el-slider {
      margin-bottom: 16px;

      :deep(.el-slider__bar) {
        background: linear-gradient(90deg, #FF5000, #ff8800);
      }

      :deep(.el-slider__button) {
        border: 2px solid #FF5000;
        width: 16px;
        height: 16px;

        &:hover,
        &.is-dragging {
          box-shadow: 0 0 0 4px rgba(255, 80, 0, 0.2);
        }
      }

      :deep(.el-slider__runway) {
        background: #ffddd0;
        height: 8px;
      }
    }

    .price-input-group {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;

      .price-input-wrapper {
        display: flex;
        align-items: center;
        gap: 4px;

        .price-prefix {
          color: #FF5000;
          font-weight: 600;
          font-size: 16px;
        }

        :deep(.price-input) {
          width: 90px;

          .el-input-number__decrease,
          .el-input-number__increase {
            background: #fff5f0;
            border-color: #ffcbb0;
            color: #FF5000;

            &:hover {
              color: #ff7020;
            }

            &.is-disabled {
              color: #ccc;
            }
          }

          :deep(.el-input__wrapper) {
            box-shadow: none;
            border: 1px solid #ffcbb0;
            background: #fff;

            &:hover,
            &.is-focus {
              border-color: #FF5000;
              box-shadow: 0 0 0 2px rgba(255, 80, 0, 0.1);
            }
          }
        }
      }

      .price-separator {
        color: #999;
        font-size: 18px;
        font-weight: 300;
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .search-layout {
    flex-direction: column;
    gap: 16px;
  }

  .filter-sidebar {
    width: 100%;
  }
}

@media screen and (max-width: 576px) {
  .search-main-content {
    padding: 16px;
  }

  .filter-card {
    &-body {
      .price-input-group {
        gap: 8px;

        .price-input-wrapper {
          :deep(.price-input) {
            width: 80px;
          }
        }
      }
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
