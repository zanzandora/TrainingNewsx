<script setup>
import { computed, ref } from 'vue'

import data from '~/lib/data/mock-data.json'

import SmallItem from './small-item.vue'

const { isOpen, close } = useSearchModal()
const query = ref('')
const filterDate = ref('')

function normalizeText(text) {
  return text
    ? text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036F]/g, '')
        .trim()
    : ''
}

const filteredItems = computed(() => {
  const q = normalizeText(query.value)
  const fd = filterDate.value ? new Date(filterDate.value).toDateString() : null

  return data.filter((item) => {
    const inText =
      normalizeText(item.title).includes(q) ||
      normalizeText(item.description).includes(q) ||
      normalizeText(item.author.name).includes(q)

    const inDate = fd ? new Date(item.pubDate).toDateString() === fd : true

    return inText && inDate
  })
})
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg">
      <!-- Header -->
      <div class="mb-4 flex items-center gap-2">
        <input
          v-model="query"
          type="text"
          placeholder="Tìm kiếm tin tức..."
          class="flex-1 rounded border px-3 py-2"
        />
        <input
          v-model="filterDate"
          type="date"
          class="rounded border px-3 py-2"
        />
        <button class="ml-2 text-sm text-gray-500" @click="close">Đóng</button>
      </div>

      <!-- Kết quả -->
      <div v-if="filteredItems.length">
        <SmallItem v-for="(news, i) in filteredItems" :key="i" :item="news" />
      </div>
      <p v-else class="text-sm text-gray-500">Không tìm thấy kết quả nào.</p>
    </div>
  </div>
</template>
