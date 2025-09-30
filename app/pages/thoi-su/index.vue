<script setup lang="ts">
import type { PostsByCategoryResponse } from '~/types/api'
import type { Post } from '~/types/article'

const page = ref(1)
const limit = 9
const allPosts = ref<Post[]>([])

const query = computed(() => ({
  limit,
  page: page.value,
}))

const { data, execute, loading, error } = useFetchData<PostsByCategoryResponse>(
  '/post/category/:slug',
  {
    params: { slug: 'thoi-su' },
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
  <UContainer>
    <UPage>
      <UPageHeader title="Thời sự" />
      <UPageBody>
        <section class="flex w-full">
          <div class="hidden w-full lg:block lg:w-1/5">
            <LazySideMenu />
          </div>

          <div class="flex-1 space-y-4">
            <!-- Error -->
            <div v-if="error" class="text-red-500">
              Có lỗi xảy ra: {{ error.message }}
            </div>

            <!-- loading lần đầu -->
            <template v-if="loading && posts.length === 0">
              <div
                class="flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16"
              >
                <USkeleton
                  v-for="i in 6"
                  :key="i"
                  class="h-96 w-full rounded-lg"
                />
              </div>
            </template>

            <!-- có bài viết -->
            <template v-else>
              <KeepAlive>
                <ArticleCard :articles="posts" />
              </KeepAlive>
              <!-- skeleton load thêm -->
              <div
                v-if="loading && posts.length > 0"
                class="flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16"
              >
                <USkeleton
                  v-for="i in 6"
                  :key="i"
                  class="h-96 w-full rounded-lg"
                />
              </div>

              <div
                v-else-if="
                  !loading && posts.length > 0 && !data?.pagination?.hasNext
                "
                class="mt-6 text-center text-gray-500"
              >
                Bạn đã xem hết tất cả bài viết.
              </div>
            </template>
          </div>
        </section>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
