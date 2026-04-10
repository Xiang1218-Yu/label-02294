import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAllProducts } from '@/api'

/**
 * 搜索状态管理Store
 * 管理搜索关键词、价格筛选等搜索相关状态
 */
export const useSearchStore = defineStore('search', () => {
  // 搜索关键词
  const keyword = ref('')
  
  // 是否处于搜索状态
  const isSearching = ref(false)
  
  // 价格筛选 - 当前选中的价格区间
  const currentMinPrice = ref(null)
  const currentMaxPrice = ref(null)

  /**
   * 计算所有商品中的最低价格
   * @returns {number} 最低价格
   */
  const globalMinPrice = computed(() => {
    const products = getAllProducts()
    if (products.length === 0) return 0
    return Math.min(...products.map(p => p.price))
  })

  /**
   * 计算所有商品中的最高价格
   * @returns {number} 最高价格
   */
  const globalMaxPrice = computed(() => {
    const products = getAllProducts()
    if (products.length === 0) return 10000
    return Math.max(...products.map(p => p.price))
  })

  /**
   * 判断是否有价格筛选条件
   * @returns {boolean} 是否有价格筛选
   */
  const hasPriceFilter = computed(() => {
    return currentMinPrice.value !== null || currentMaxPrice.value !== null
  })

  /**
   * 设置搜索关键词
   * @param {string} value - 搜索关键词
   */
  function setKeyword(value) {
    keyword.value = value
    isSearching.value = !!value.trim()
  }

  /**
   * 清除搜索状态
   */
  function clearSearch() {
    keyword.value = ''
    isSearching.value = false
    clearPriceFilter()
  }

  /**
   * 设置价格筛选条件
   * @param {number|null} minPrice - 最低价格
   * @param {number|null} maxPrice - 最高价格
   */
  function setPriceFilter(minPrice, maxPrice) {
    currentMinPrice.value = minPrice
    currentMaxPrice.value = maxPrice
  }

  /**
   * 清除价格筛选条件
   */
  function clearPriceFilter() {
    currentMinPrice.value = null
    currentMaxPrice.value = null
  }

  /**
   * 获取当前价格筛选范围（用于组件显示）
   * @returns {Object} 包含minPrice和maxPrice的对象
   */
  function getCurrentPriceRange() {
    return {
      minPrice: currentMinPrice.value,
      maxPrice: currentMaxPrice.value
    }
  }

  return {
    keyword,
    isSearching,
    currentMinPrice,
    currentMaxPrice,
    globalMinPrice,
    globalMaxPrice,
    hasPriceFilter,
    setKeyword,
    clearSearch,
    setPriceFilter,
    clearPriceFilter,
    getCurrentPriceRange
  }
})
