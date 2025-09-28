<script setup lang="ts">
import { ref } from 'vue'

// Quản lý trạng thái bộ lọc sắp xếp
const sortValue = ref('newest')
const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Cũ nhất', value: 'oldest' },
]
</script>

<template>
  <div class="sticky top-0 h-max px-4">
    <h1 class="mb-4 mt-8 text-sm font-medium">Lọc</h1>
    <URadioGroup
      v-model="sortValue"
      :items="sortOptions"
      class="flex flex-col gap-2 text-sm"
    />
  </div>
</template>
