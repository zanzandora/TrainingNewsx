<script setup lang="ts">
import type { PostsByCategoryResponse } from '~/types/api'
import type { Post } from '~/types/article'

// Set page title and meta
useSeoMeta({
  title: 'Trang chủ - Training News',
  description:
    'Trang tin tức hàng đầu với các bài viết nóng hổi và cập nhật mới nhất',
  ogTitle: 'Training News - Trang tin tức hàng đầu',
  ogDescription: 'Đọc tin tức mới nhất, nóng hổi từ các lĩnh vực khác nhau',
})

const page = ref(1)
const limit = 9
const allPosts = ref<Post[]>([])

const query = computed(() => ({
  limit,
  page: page.value,
}))

const { data, execute, loading } = useFetchData<PostsByCategoryResponse>(
  '/post/category/:slug',
  {
    params: { slug: 'trang-chu' },
    query,
    immediate: true,
  },
)

watch(data, () => {
  if (data.value?.posts) {
    const newPosts = data.value.posts.filter(
      (newPost) =>
        !allPosts.value.some((existingPost) => existingPost.id === newPost.id),
    )
    allPosts.value.push(...newPosts)
  }
})

const posts = computed(() => allPosts.value)

useInfiniteScroll(
  window,
  async () => {
    if (loading.value) return
    if (!data.value?.pagination?.hasNext) return
    page.value++

    await execute()
  },
  {
    distance: 100,
    canLoadMore: () => data.value?.pagination?.hasNext === true,
  },
)
</script>

<template>
  <div>
    <UContainer>
      <UPage>
        <!-- Page title section -->
        <UPageHeader>
          <div class="py-8">
            <UContainer>
              <div class="space-y-4 text-center">
                <h1
                  class="text-4xl font-bold text-gray-900 md:text-5xl dark:text-white"
                >
                  Training News
                </h1>
                <p class="text-lg text-gray-600 md:text-xl dark:text-gray-300">
                  Tin tức nóng hổi • Cập nhật liên tục • Đa dạng chủ đề
                </p>
              </div>
            </UContainer>
          </div>
        </UPageHeader>

        <div class="mx-auto mb-16 max-w-7xl">
          <ArticleCard :post="posts[0]" :featured="true" />
        </div>

        <!-- Main  -->
        <UPageBody>
          <ArticleCard :articles="posts" />
        </UPageBody>
      </UPage>
    </UContainer>
  </div>
</template>
