<script setup lang="ts">
import { LIMIT_MENU_ITEMS, navigationLinks } from '~/lib/constain'

const route = useRoute()

// Tạo các liên kết breadcrumb động
const pathLinks = computed(() => {
  // Lấy đường dẫn hiện tại và chia thành các đoạn
  const segments = route.path.split('/').filter(Boolean)

  // Tạo mảng breadcrumb với liên kết 'Home' đầu tiên
  const breadcrumbs = [
    {
      label: 'trang-chu',
      to: '/',
    },
  ]

  let currentPath = ''
  segments.forEach((segment) => {
    currentPath += `/${segment}`
    breadcrumbs.push({
      label: segment,
      to: currentPath,
    })
  })

  return breadcrumbs
})

// Lấy các mục hiển thị ban đầu
const visibleCats = computed(() => navigationLinks.slice(0, LIMIT_MENU_ITEMS))

// Lấy các mục còn lại để hiển thị trong Popover
const remainingCats = computed(() => navigationLinks.slice(LIMIT_MENU_ITEMS))
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

    <UNavigationMenu :items="visibleCats" class="text-xl" />

    <template #right>
      <UInput
        placeholder="Search..."
        icon="i-heroicons-magnifying-glass-20-solid"
      />
      <UColorModeButton />
    </template>

    <!-- Breadcrumb -->
    <template #bottom>
      <UContainer>
        <UBreadcrumb :items="pathLinks" class="mt-2 text-sm" />
      </UContainer>
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
