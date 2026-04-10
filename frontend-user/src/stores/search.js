import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recommendProducts } from '@/api'

export const useSearchStore = defineStore('search', () => {
  const keyword = ref('')
  const isSearching = ref(false)
  // 计算价格极值：保证所有商品都落在这个范围内
  // 所有商品中的最低价格
  const minProductPrice = computed(() => {
    if (recommendProducts.length === 0) return 0
    return Math.min(...recommendProducts.map(p => p.price))
  })

  // 所有商品中的最高价格
  const maxProductPrice = computed(() => {
    if (recommendProducts.length === 0) return 10000
    return Math.max(...recommendProducts.map(p => p.price))
  })

  // 价格范围状态：[minPrice, maxPrice]
  // 使用computed的极值来初始化
  const priceRange = ref([null, null])

  function setKeyword(value) {
    keyword.value = value
    isSearching.value = !!value.trim()
  }

  function clearSearch() {
    keyword.value = ''
    isSearching.value = false
  }

  // 设置价格范围
  function setPriceRange(range) {
    priceRange.value = range
  }

  // 重置价格范围
  function resetPriceRange() {
    priceRange.value = [null, null]
  }

  // 清除所有搜索条件（包括价格）
  function clearAllFilters() {
    clearSearch()
    resetPriceRange()
  }

  return {
    keyword,
    isSearching,
    priceRange,
    minProductPrice,
    maxProductPrice,
    setKeyword,
    clearSearch,
    setPriceRange,
    resetPriceRange,
    clearAllFilters
  }
})
