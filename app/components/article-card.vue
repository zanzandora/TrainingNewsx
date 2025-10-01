<script setup lang="ts">
import type { Post } from '~/types/article'

const props = defineProps<{
  featured?: boolean
  post?: Post
  articles?: Post[]
}>()

const articles = computed(() => props.articles ?? [])
</script>

<template>
  <!-- Featured post -->
  <template v-if="featured && post">
    <div class="relative overflow-hidden rounded-xl shadow-lg">
      <NuxtLink :to="`/d/${post.slug}`">
        <NuxtImg
          :src="post.image ?? '/placeholder.svg'"
          :alt="post.title"
          class="h-[400px] w-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
        />
        <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
          <UBadge variant="solid" color="secondary" class="mb-4">
            <!-- {{ post.categories?.[0] }} -->
            Trang chủ
          </UBadge>

          <h2 class="mb-4 text-3xl font-bold leading-tight">
            {{ post.title }}
          </h2>

          <div class="flex items-center space-x-3 text-sm">
            <UAvatar
              :src="post.author.avatar?.src || '/placeholder.svg'"
              :alt="post.author.name"
              size="sm"
            />
            <span class="font-medium text-white">{{ post.author.name }}</span>
            <span class="text-white/80">{{ post.pubDate }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </template>

  <!-- Articles list -->
  <template v-else-if="articles?.length">
    <UBlogPosts>
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="`/d/${article.slug}`"
      >
        <UBlogPost
          :title="article.title"
          :image="article.image ?? '/placeholder.svg'"
          :date="article.pubDate"
          :badge="{ label: 'Tin tức', color: 'secondary', variant: 'solid' }"
          :authors="[
            {
              name: article.author.name,
              avatar: { src: article.author.avatar?.src },
              to: `/author/${article.author.name}`,
            },
          ]"
          class="h-full transform shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
        />
      </NuxtLink>
    </UBlogPosts>
  </template>

  <!-- Empty -->
  <p v-else class="text-gray-500">No articles available.</p>
</template>
