<script setup lang="ts">
import type { Article } from '~/types/article'

const _props = withDefaults(
  defineProps<{
    articles?: Article[]
    image?: string
    category?: string
    title?: string
    description?: string
    author?: {
      name?: string
      avarta?: {
        src?: string
      }
    }
    pubDate?: string
    featured?: boolean
  }>(),
  {
    articles: () => [], // default tránh undefined
  },
)
</script>

<template>
  <!-- Nếu có post nổi bật -->
  <div v-if="featured" class="relative overflow-hidden rounded-xl shadow-lg">
    <NuxtImg
      :src="image || '/placeholder.svg'"
      :alt="title"
      class="h-[400px] w-full object-cover"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
    />
    <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
      <UBadge variant="solid" class="mb-4">{{ category }}</UBadge>
      <h2 class="mb-4 text-3xl font-bold leading-tight">{{ title }}</h2>

      <div class="flex items-center space-x-3 text-sm">
        <UAvatar
          :src="author?.avarta?.src || '/placeholder.svg'"
          :alt="author?.name"
          size="sm"
        />
        <span class="font-medium text-white">{{ author?.name }}</span>
        <span class="text-white/80">{{ pubDate }}</span>
      </div>
    </div>
  </div>

  <!-- Nếu có nhiều articles -->
  <UBlogPosts v-else-if="articles.length">
    <UBlogPost
      v-for="(article, index) in articles"
      :key="index"
      variant="soft"
      :title="article.title"
      :image="article.image"
      :date="article.pubDate"
      :badge="{
        label: 'Tin tức',
        color: 'secondary',
        variant: 'solid',
      }"
      :authors="[
        {
          name: article.author?.name,
          avatar: { src: article.author?.avarta?.src },
        },
      ]"
    />
  </UBlogPosts>

  <!-- Nếu không có gì -->
  <p v-else class="text-gray-500">No articles available.</p>
</template>
