<script setup lang="ts">
import type { Category } from '~/types/category'

import { LIMIT_MENU_ITEMS } from '~/lib/constain'

const { data: navigationLinks, loading } = useFetchData<Category[]>(
  '/category',
  {
    immediate: true,
  },
)

// Map sang định dạng menu item
const categories = computed(() => {
  if (!navigationLinks.value) return []
  return navigationLinks.value
    .map((cat) => ({
      label: cat.name,
      slug: cat.slug,
      to: `/${cat.slug}`,
      icon: cat.slug === 'trang-chu' ? 'i-heroicons-home' : undefined,
    }))
    .sort((a, b) =>
      a.slug === 'trang-chu' ? -1 : b.slug === 'trang-chu' ? 1 : 0,
    )
})

// Lấy các mục hiển thị ban đầu
const visibleCats = computed(() => categories.value.slice(0, LIMIT_MENU_ITEMS))

// Lấy các mục còn lại để hiển thị trong Popover
const remainingCats = computed(() => categories.value.slice(LIMIT_MENU_ITEMS))
</script>

<template>
  <UHeader
    :toggle="{
      color: 'primary',
      variant: 'subtle',
      class: 'rounded-full',
    }"
  >
    <template #title>
      <NuxtImg width="56px" src="/icon-green.png" format="webp" alt="" />
    </template>

    <template v-if="loading">
      <USkeleton v-for="i in 5" :key="i" class="mx-6 h-6 w-20 rounded-md" />
    </template>

    <UNavigationMenu :items="visibleCats" class="text-xl" />

    <template #right>
      <UInput
        placeholder="Search..."
        icon="i-heroicons-magnifying-glass-20-solid"
      />
      <UColorModeButton />
    </template>

    <UPopover v-if="remainingCats.length" class="ml-4">
      <UButton
        color="secondary"
        variant="link"
        icon="i-heroicons-arrow-down-solid"
        aria-label="More categories"
      />
      <template #content>
        <UNavigationMenu
          :items="remainingCats"
          orientation="vertical"
          class="mx-2 p-2"
        />
      </template>
    </UPopover>
  </UHeader>
</template>
