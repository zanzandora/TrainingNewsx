<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const { metaSymbol } = useShortcuts()
const { toggle } = useSearchModal()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    active: route.path.startsWith('/docs/getting-started'),
  },
  {
    label: 'Categories',
    to: '/categories',
    active: route.path.startsWith('/docs/components'),
  },
  {
    label: 'About',
    to: '/about',
    active: route.path.startsWith('/docs/components'),
  },
  {
    label: 'Contact',
    to: 'https://github.com/nuxt/ui/releases',
    active: route.path.startsWith('/docs/components'),
  },
])
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

    <UNavigationMenu :items="items" class="text-xl" />
    <template #right>
      <UTooltip text="Search" :shortcuts="[metaSymbol, 'k']">
        <UButton
          icon="i-ph-magnifying-glass-bold"
          variant="ghost"
          square
          @click="toggle"
        >
          <span class="sr-only">Search</span>
        </UButton>
      </UTooltip>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
