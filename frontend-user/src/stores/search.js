import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const keyword = ref('')
  const isSearching = ref(false)
  const selectedMinPrice = ref(0)
  const selectedMaxPrice = ref(0)

  function setKeyword(value) {
    keyword.value = value
    isSearching.value = !!value.trim()
  }

  function clearSearch() {
    keyword.value = ''
    isSearching.value = false
    selectedMinPrice.value = 0
    selectedMaxPrice.value = 0
  }

  function setPriceRange(min, max) {
    selectedMinPrice.value = min
    selectedMaxPrice.value = max
  }

  function resetPriceRange() {
    selectedMinPrice.value = 0
    selectedMaxPrice.value = 0
  }

  return {
    keyword,
    isSearching,
    selectedMinPrice,
    selectedMaxPrice,
    setKeyword,
    clearSearch,
    setPriceRange,
    resetPriceRange
  }
})
