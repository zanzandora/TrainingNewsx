<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

// const items = computed<NavigationMenuItem[]>(() => [
//   {
//     label: 'Home',
//     to: '/',
//     active: route.path.startsWith('/docs/getting-started'),
//   },
//   {
//     label: 'List',
//     to: '/article-list',
//     active: route.path.startsWith('/docs/components'),
//   },
//   {
//     label: 'About',
//     to: '/about',
//     active: route.path.startsWith('/docs/components'),
//   },
//   {
//     label: 'Contact',
//     to: 'https://github.com/nuxt/ui/releases',
//     active: route.path.startsWith('/docs/components'),
//   },
// ])

const cats = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    active: route.path.startsWith('/home'),
  },
  {
    label: 'Thời sự',
    to: '/thoisu',
    active: route.path.startsWith('/thoisu'),
  },
  {
    label: 'Thời sự',
    to: '/about',
    active: route.path.startsWith('/docs/components'),
  },
  {
    label: 'Thời sự',
    to: 'https://github.com/nuxt/ui/releases',
    active: route.path.startsWith('/docs/components'),
  },
  {
    label: 'Thời sự',
    to: 'https://github.com/nuxt/ui/releases',
    active: route.path.startsWith('/docs/components'),
  },
  {
    label: 'Thời sự',
    to: 'https://github.com/nuxt/ui/releases',
    active: route.path.startsWith('/docs/components'),
  },
  {
    label: 'Thời sự',
    to: 'https://github.com/nuxt/ui/releases',
    active: route.path.startsWith('/docs/components'),
  },
  {
    label: 'Thời sự',
    to: 'https://github.com/nuxt/ui/releases',
    active: route.path.startsWith('/docs/components'),
  },
  {
    label: 'Thời sự',
    to: 'https://github.com/nuxt/ui/releases',
    active: route.path.startsWith('/docs/components'),
  },
])

// Giới hạn số lượng mục hiển thị ban đầu
const limit = 5

// Lấy các mục hiển thị ban đầu
const visibleCats = computed(() => cats.value.slice(0, limit))

// Lấy các mục còn lại để hiển thị trong Popover
const remainingCats = computed(() => cats.value.slice(limit))
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
    <UPopover v-if="remainingCats.length" class="ml-4">
      <UButton
        color="secondary"
        variant="ghost"
        icon="i-heroicons-arrow-down-solid"
      />

      <template #panel>
        <UVerticalNavigation :links="remainingCats" class="w-40 p-4" />
      </template>
    </UPopover>
  </UHeader>
</template>
