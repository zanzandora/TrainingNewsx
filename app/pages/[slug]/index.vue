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
</script>

<template>
  <div class="mb-16 py-8">
    <UContainer>
      <div class="flex flex-col gap-8 lg:flex-row">
        <div class="flex flex-col gap-8 lg:w-3/5">
          <h1 class="text-3xl font-bold md:text-4xl xl:text-5xl">
            {{ post?.title }}
          </h1>

          <div class="flex items-center gap-2 text-sm text-gray-400">
            <span>Written by</span>
            <UButton
              :to="`/author/${post?.author.name}`"
              variant="link"
              color="primary"
            >
              {{ post?.author.name }}
            </UButton>
            <span>on</span>
            <UButton to="`/category/regerg`" variant="link" color="primary">
              Thời sự
            </UButton>
            <span>{{ dayjs(post?.pubDate).format('DD/MM/YYYY') }}</span>
          </div>

          <p class="text-muted font-medium leading-relaxed">
            {{ post?.description }}
          </p>
        </div>

        <div class="hidden w-2/5 lg:block">
          <NuxtImg
            :src="post?.image ?? '/placeholder.svg'"
            :alt="post?.author.name"
            class="h-auto w-full rounded-2xl object-cover shadow-lg"
            sizes="sm:500px md:600px lg:800px"
          />
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-4" v-html="post?.content" />
    </UContainer>
  </div>
</template>
