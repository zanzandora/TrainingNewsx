<script setup lang="ts">
import { ref } from 'vue'

import { baseCategories } from '~/lib/constain'

// Quản lý trạng thái bộ lọc sắp xếp
const sortValue = ref('newest')
const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Cũ nhất', value: 'oldest' },
]

// thêm state để lọc theo loại
const filterByValue = ref('news')
const filterByOptions = [
  { label: 'Tin tức', value: 'news' },
  { label: 'Tác giả', value: 'author' },
]

// thêm state cho chuyên mục
const categoriesWithAll = [
  { label: 'Tất cả', slug: 'all' }, // slug undefined = không lọc
  ...baseCategories,
]
const selectedCategory = ref<string | undefined>(categoriesWithAll[0]?.slug)
</script>

<template>
  <div class="sticky top-20 h-max px-4">
    <h1
      class="mb-6 mt-4 border-b border-gray-200 pb-2 text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-100"
    >
      Lọc
    </h1>
    <div class="mt-6">
      <!-- Lọc theo chuyên mục -->
      <div class="mt-6">
        <label class="mb-2 block text-sm font-medium">Chuyên mục</label>
        <USelect
          v-model="selectedCategory"
          :items="categoriesWithAll"
          label-key="label"
          value-key="slug"
          :clearable="true"
          placeholder="Chọn chuyên mục"
          class="w-full max-w-xs text-sm"
        />
      </div>
      <!-- Lọc theo đối tượng-->
      <div class="mt-6">
        <label class="mb-2 block text-sm font-medium">Tìm theo</label>
        <USelect
          v-model="filterByValue"
          :items="filterByOptions"
          label-key="label"
          value-key="value"
          :clearable="false"
          placeholder="Chọn loại"
          class="w-full max-w-xs text-sm"
        />
      </div>
    </div>
    <!-- Lọc theo cũ/mới nhất-->
    <div class="mt-6">
      <label class="mb-2 block text-sm font-medium">Thứ tự</label>
      <URadioGroup
        v-model="sortValue"
        :items="sortOptions"
        class="flex flex-col gap-2 text-sm"
      />
    </div>
  </div>
</template>
