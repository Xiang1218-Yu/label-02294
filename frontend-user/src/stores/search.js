import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  // 搜索关键词
  const keyword = ref('')
  // 是否处于搜索状态
  const isSearching = ref(false)

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
  }

  return {
    keyword,
    isSearching,
    setKeyword,
    clearSearch
  }
})
