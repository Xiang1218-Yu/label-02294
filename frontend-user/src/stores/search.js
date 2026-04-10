import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recommendProducts } from '@/api'

export const useSearchStore = defineStore('search', () => {
  const keyword = ref('')
  const isSearching = ref(false)
  // 选中的最小价格和最大价格
  const selectedMinPrice = ref(0)
  const selectedMaxPrice = ref(0)

  // 计算所有商品中的最低价格
  const minPrice = computed(() => {
    if (recommendProducts.length === 0) return 0
    return Math.min(...recommendProducts.map(p => p.price))
  })

  // 计算所有商品中的最高价格
  const maxPrice = computed(() => {
    if (recommendProducts.length === 0) return 0
    return Math.max(...recommendProducts.map(p => p.price))
  })

  function setKeyword(value) {
    keyword.value = value
    isSearching.value = !!value.trim()
  }

  function clearSearch() {
    keyword.value = ''
    isSearching.value = false
    resetPriceRange()
  }

  // 设置选中的价格范围
  function setPriceRange(minVal, maxVal) {
    selectedMinPrice.value = minVal
    selectedMaxPrice.value = maxVal
  }

  // 重置价格范围到默认值
  function resetPriceRange() {
    selectedMinPrice.value = minPrice.value
    selectedMaxPrice.value = maxPrice.value
  }

  // 初始化价格范围
  function initPriceRange() {
    selectedMinPrice.value = minPrice.value
    selectedMaxPrice.value = maxPrice.value
  }

  return {
    keyword,
    isSearching,
    selectedMinPrice,
    selectedMaxPrice,
    minPrice,
    maxPrice,
    setKeyword,
    clearSearch,
    setPriceRange,
    resetPriceRange,
    initPriceRange
  }
})
