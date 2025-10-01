<script setup lang="ts">
import type { PostsByAuthorResponse } from '~/types/api'
import type { Post } from '~/types/article'

const page = ref(1)
const limit = 9
const allPosts = ref<Post[]>([])

const route = useRoute()
const slug = computed(() => route.params.slug)

const query = computed(() => ({
  limit,
  page: page.value,
}))

const { data, execute, loading } = useFetchData<PostsByAuthorResponse>(
  `/post/author/${slug.value}`,
  {
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
                  Tác giả
                </h1>
                <p class="text-lg text-gray-600 md:text-xl dark:text-gray-300">
                  Thông tin tác giả • Các tin tức đã đăng
                </p>
              </div>
            </UContainer>
          </div>

          <!-- Author Profile Section -->
          <UCard class="mb-8">
            <div class="flex flex-col items-center gap-6 p-4 md:flex-row">
              <UAvatar
                :src="data?.author?.avatar.src || '/placeholder.svg'"
                alt="Author avatar"
                size="2xl"
              />
              <div class="flex-1 text-center md:text-left">
                <h1 class="mb-2 text-2xl font-bold">{{ data?.author.name }}</h1>
                <p class="mb-2 text-gray-600">Phóng viên báo Tuổi trẻ</p>
                <p class="text-sm text-gray-500">
                  Tổng số tin tức: {{ posts.length }}
                </p>
              </div>
            </div>
          </UCard>
        </UPageHeader>

        <!-- Main  -->
        <UPageBody>
          <h2 class="mb-4 text-xl font-semibold">Bài viết của tác giả này</h2>
          <ArticleCard :articles="posts" />
        </UPageBody>
      </UPage>
    </UContainer>
  </div>
</template>
