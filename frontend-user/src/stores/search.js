import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const keyword = ref('')
  const isSearching = ref(false)

  function setKeyword(value) {
    keyword.value = value
    isSearching.value = !!value.trim()
  }

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
