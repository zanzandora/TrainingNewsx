/* eslint-disable unicorn/filename-case */
import { useLocalStorage } from '@vueuse/core'
import Fuse from 'fuse.js'

import type { Article } from '~/types/article'

type SearchOptions = {
  keys?: string[]
  threshold?: number
  minMatchCharLength?: number
  immediate?: boolean
}

export function useSearch(
  initialQuery: string = '',
  options: SearchOptions = {},
) {
  const {
    keys = ['title', 'description', 'content', 'author.name'],
    threshold = 0.4,
    minMatchCharLength = 2,
    immediate = false,
  } = options

  // Sử dụng localStorage để lưu lịch sử tìm kiếm
  const searchHistory = useLocalStorage<string[]>('search-history', [])

  const query = ref(initialQuery)
  const results = ref<Article[]>([])
  const isLoading = ref(false)
  const totalResults = ref(0)
  const error = ref<string | null>(null)

  let fuse: Fuse<Article>

  // Sử dụng useAsyncState từ VueUse cho data fetching
  const { state: searchData, execute: loadSearchData } = useAsyncState<
    Article[]
  >(
    async () => {
      // TODO: Uncomment và implement khi APIs sẵn sàng
      /*
      try {
        const data = await $fetch('/api/search/all')
        return data
      } catch (err) {
        console.error('Error fetching search data:', err)
        error.value = 'Failed to load search data'
        return []
      }
      */

      // Tạm thời dùng mock data
      const mockData = await import('~/lib/data/mock-data.json')
      return mockData.default
    },
    [],
    {
      immediate,
      resetOnExecute: false,
    },
  )

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      results.value = []
      totalResults.value = 0
      error.value = null
      return
    }

    isLoading.value = true
    error.value = null

    try {
      // Thêm vào lịch sử tìm kiếm
      if (!searchHistory.value.includes(searchQuery)) {
        searchHistory.value = [searchQuery, ...searchHistory.value.slice(0, 9)]
      }

      // TODO: Uncomment khi API sẵn sàng
      /*
      const { data } = await $fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      results.value = data
      totalResults.value = data.length
      */

      // Tạm thời search local
      if (fuse) {
        const fuseResults = fuse.search(searchQuery)
        results.value = fuseResults.map((result) => result.item)
        totalResults.value = fuseResults.length
      }
    } catch (err) {
      console.error('Search error:', err)
      error.value = 'Search failed. Please try again.'
      results.value = []
      totalResults.value = 0
    } finally {
      isLoading.value = false
    }
  }

  // Khởi tạo Fuse.js khi data được load
  watch(
    searchData,
    (data) => {
      if (data && data.length > 0) {
        fuse = new Fuse(data, {
          keys,
          threshold,
          minMatchCharLength,
          includeMatches: true,
          includeScore: true,
        })

        // Tự động search nếu có query ban đầu
        if (query.value) {
          performSearch(query.value)
        }
      }
    },
    { immediate: true },
  )

  // Debounced search cho real-time search (nếu cần)

  const search = (searchQuery: string) => {
    query.value = searchQuery
    // Không dùng debounce vì đã có query string navigation
    performSearch(searchQuery)
  }

  const clearSearch = () => {
    query.value = ''
    results.value = []
    totalResults.value = 0
    error.value = null
  }

  const clearHistory = () => {
    searchHistory.value = []
  }

  return {
    // State
    query: readonly(query),
    results: readonly(results),
    isLoading: readonly(isLoading),
    totalResults: readonly(totalResults),
    error: readonly(error),
    searchHistory: readonly(searchHistory),

    // Methods
    search,
    clearSearch,
    clearHistory,
    loadSearchData,

    // For reactive updates
    updateQuery: (newQuery: string) => {
      query.value = newQuery
    },
  }
}
