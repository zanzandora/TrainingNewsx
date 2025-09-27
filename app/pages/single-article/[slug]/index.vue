<script setup lang="ts">
import dayjs from 'dayjs'

import articles from '~/lib/data/mock-data.json'
</script>

<template>
  <div class="mb-16 py-8">
    <UContainer>
      <div class="flex flex-col gap-8 lg:flex-row">
        <div class="flex flex-col gap-8 lg:w-3/5">
          <h1 class="text-3xl font-bold md:text-4xl xl:text-5xl">
            {{ articles[0]?.title }}
          </h1>

          <div class="flex items-center gap-2 text-sm text-gray-400">
            <span>Written by</span>
            <UButton
              :to="`/author/${articles[0]?.author.name}`"
              variant="link"
              color="primary"
            >
              {{ articles[0]?.author.name }}
            </UButton>
            <span>on</span>
            <UButton to="`/category/regerg`" variant="link" color="primary">
              Thời sự
            </UButton>
            <span>{{ dayjs(articles[0]?.pubDate).format('DD/MM/YYYY') }}</span>
          </div>

          <p class="text-muted font-medium leading-relaxed">
            {{ articles[0]?.description }}
          </p>
        </div>

        <div class="hidden w-2/5 lg:block">
          <NuxtImg
            :src="articles[0]?.image"
            :alt="articles[0]?.author.name"
            class="h-auto w-full rounded-2xl object-cover shadow-lg"
            sizes="sm:500px md:600px lg:800px"
          />
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-4" v-html="articles[0]?.content" />
    </UContainer>
  </div>
</template>
