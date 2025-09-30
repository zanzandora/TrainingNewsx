<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'

import type { Category } from '~/types/category'

import { LIMIT_MENU_ITEMS } from '~/lib/constain'

const router = useRouter()

// Mock user state (sau này thay bằng Pinia hoặc dữ liệu từ API)
const user = ref<any>(null) // null = chưa login, có object = đã login

const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  } else {
    user.value = null
  }
}

onMounted(() => {
  loadUserFromStorage() // Tải khi component được mount lần đầu
})

if (import.meta.client) {
  // Đảm bảo chỉ chạy ở client-side
  onBeforeRouteUpdate(() => {
    loadUserFromStorage() // Tải lại user mỗi khi route thay đổi
  })
}

const items: DropdownMenuItem[] = [
  {
    label: 'Đăng xuất',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: () => logout(),
  },
]

// Logout
const logout = () => {
  localStorage.removeItem('user')
  user.value = null // Cập nhật trạng thái người dùng
  router.push('/auth/auth')
}

const { data: navigationLinks, loading } = useFetchData<Category[]>(
  '/category',
  {
    immediate: true,
  },
)
// const router = useRouter()
// Map sang định dạng menu item
const categories = computed(() => {
  if (!navigationLinks.value) return []
  // Helper function to sort categories, putting 'trang-chu' first
  function sortCategories(a: { slug: string }, b: { slug: string }) {
    if (a.slug === 'trang-chu') return -1
    if (b.slug === 'trang-chu') return 1
    return 0
  }
  return navigationLinks.value
    .map((cat) => ({
      label: cat.name,
      slug: cat.slug,
      to: cat.slug === 'trang-chu' ? '/' : `/cat/${cat.slug}?t=${cat.name}`,
      icon: cat.slug === 'trang-chu' ? 'i-heroicons-home' : undefined,
    }))
    .sort(sortCategories)
})

// Lấy các mục hiển thị ban đầu
const visibleCats = computed(() => categories.value.slice(0, LIMIT_MENU_ITEMS))

// Lấy các mục còn lại để hiển thị trong Popover
const remainingCats = computed(() => categories.value.slice(LIMIT_MENU_ITEMS))

// Navigate to login
const goToAuth = () => {
  router.push('/auth/auth')
}
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
      <!-- Nếu chưa đăng nhập thì hiện nút -->
      <UButton
        v-if="!user"
        color="primary"
        variant="soft"
        class="ml-3"
        icon="i-heroicons-arrow-left-on-rectangle"
        aria-label="Đăng nhập"
        @click="goToAuth"
      />

      <!-- Nếu đã đăng nhập thì hiện avatar mặc định -->

      <!-- <UDropdown
        :items="items"
        :popper="{ placement: 'bottom-end' }"
        class="ml-3"
      >
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-user-circle"
          trailing-icon="i-heroicons-chevron-down-20-solid"
          aria-label="Tài khoản"
        />
      </UDropdown> -->
      <UFieldGroup v-else>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-user-circle"
          class="ml-3"
          aria-label="User Avatar"
        />
        <UDropdownMenu :items="items">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-down"
          />
        </UDropdownMenu>
      </UFieldGroup>
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
