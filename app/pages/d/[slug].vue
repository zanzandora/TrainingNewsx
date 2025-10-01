<script setup lang="ts">
import dayjs from 'dayjs'

import type { Post } from '~/types/article'

const route = useRoute()

// Lấy slug từ URL
const slug = computed(() => route.params.slug)

const { data: post } = useFetchData<Post>('/post/:slug', {
  params: { slug: slug.value as string },
  immediate: true,
})

// Set dynamic SEO meta tags based on post data
watch(
  post,
  (newPost) => {
    console.log('🚀 ~ post:', post.value)
    if (newPost) {
      useSeoMeta({
        title: `${newPost.title} - Training News`,
        description:
          newPost.description ||
          `Đọc bài viết "${newPost.title}" trên Training News. Tin tức mới nhất và đáng tin cậy.`,
        ogTitle: newPost.title,
        ogDescription:
          newPost.description ||
          `Đọc bài viết "${newPost.title}" trên Training News`,
        ogImage: newPost.image,
        twitterCard: 'summary_large_image',
        twitterTitle: newPost.title,
        twitterDescription: newPost.description,
        twitterImage: newPost.image,
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="mb-16 py-8">
    <UContainer>
      <!-- Breadcrumb Navigation -->
      <nav class="mb-8" aria-label="Breadcrumb">
        <div
          class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
        >
          <UButton variant="ghost" color="neutral" @click="$router.push('/')">
            <UIcon name="i-heroicons-home" class="h-4 w-4" />
            Trang chủ
          </UButton>
          <UIcon name="i-heroicons-chevron-right" class="h-4 w-4" />
          <UButton variant="ghost" color="neutral" @click="$router.back()">
            {{ post?.categories[0]?.name || 'Tin tức' }}
          </UButton>
          <UIcon name="i-heroicons-chevron-right" class="h-4 w-4" />
          <span class="text-primary font-medium">{{
            post?.title || 'Đang tải...'
          }}</span>
        </div>
      </nav>

      <div class="flex w-full flex-col gap-8 lg:flex-row">
        <div class="flex flex-col gap-8">
          <!-- Back Button -->
          <div class="flex items-center gap-4">
            <UButton variant="outline" color="neutral" @click="$router.back()">
              <UIcon name="i-heroicons-arrow-left" class="h-4 w-4" />
              Trở lại
            </UButton>
          </div>

          <!-- Article Title -->
          <h1
            class="w-full text-3xl font-bold leading-tight text-gray-900 md:text-4xl xl:text-5xl dark:text-white"
          >
            {{ post?.title || 'Đang tải bài viết...' }}
          </h1>

          <!-- Article Meta Information -->
          <div
            class="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          >
            <span>Viết bởi</span>
            <NuxtLink
              :to="`/author/${post?.author.name}`"
              class="cursor-pointer"
            >
              <UButton variant="link" color="primary" size="sm">
                <UIcon name="i-heroicons-user-circle" class="h-4 w-4" />
                {{ post?.author.name || 'Tác giả' }}
              </UButton>
            </NuxtLink>
            <span>•</span>
            <UButton variant="link" color="primary" size="sm">
              <UIcon name="i-heroicons-tag" class="h-4 w-4" />
              Thời sự
            </UButton>
            <span>•</span>
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar-days" class="h-4 w-4" />
              <span>{{
                post?.pubDate
                  ? dayjs(post.pubDate).format('DD/MM/YYYY')
                  : 'Đang cập nhật'
              }}</span>
            </div>
          </div>

          <!-- Article Description -->
          <div class="border-primary border-l-4 pl-4">
            <p
              class="text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-300"
            >
              {{ post?.description || 'Mô tả bài viết đang được tải...' }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-4" v-html="post?.content" />

      <CommentSection :post-id="slug as string" />
    </UContainer>
  </div>
</template>
