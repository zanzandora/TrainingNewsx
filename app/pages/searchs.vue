<script setup lang="ts">
import type { PostsByCategoryResponse } from '~/types/api'
import type { Post } from '~/types/article'

const route = useRoute()
const page = ref(1)
const limit = 9
const allPosts = ref<Post[]>([])
const categoryChanged = ref('')
const sortChanged = ref('newest')

// Reactive query computed
const query = computed(() => ({
  limit,
  page: page.value,
  q: (route.query.q as string) || '',
  category: categoryChanged.value,
  sort: sortChanged.value,
}))

const { data, execute, loading, error } = useFetchData<PostsByCategoryResponse>(
  '/post/search',
  {
    query,
    immediate: true,
  },
)

// Watch route query changes để reset khi search term thay đổi
watch(
  () => route.query.q,
  (newQ, oldQ) => {
    if (newQ !== oldQ) {
      // Reset về trang 1 và xóa posts cũ khi search term thay đổi
      page.value = 1
      allPosts.value = []
      execute() // Gọi lại API với search term mới
    }
  },
  { immediate: false },
)

// Watch category và sort changes
watch([categoryChanged, sortChanged], () => {
  // Reset về trang 1 và xóa posts cũ khi filter thay đổi
  page.value = 1
  allPosts.value = []
  execute() // Gọi lại API với filter mới
})

// Watch data để append posts mới
watch(data, () => {
  if (data.value?.posts) {
    if (page.value === 1) {
      // Nếu là trang đầu tiên, thay thế toàn bộ
      allPosts.value = data.value.posts
    } else {
      // Nếu là load more, append vào cuối
      const newPosts = data.value.posts.filter(
        (newPost) =>
          !allPosts.value.some(
            (existingPost) => existingPost.id === newPost.id,
          ),
      )
      allPosts.value.push(...newPosts)
    }
  }
})

const posts = computed(() => allPosts.value)

// Infinite scroll
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

// SEO Meta tags
useSeoMeta({
  title: `Tìm kiếm: ${route.query.q || 'Tất cả bài viết'} - Training News`,
  description: `Kết quả tìm kiếm cho "${route.query.q}" trên Training News. Khám phá những bài viết liên quan đến chủ đề bạn quan tâm.`,
})
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        :title="`Kết quả tìm kiếm cho: ${route.query.q || 'Tất cả bài viết'}`"
      />
      <UPageBody>
        <section class="flex w-full">
          <div class="hidden w-full lg:block lg:w-1/5">
            <LazySideMenu
              @category-change="categoryChanged = $event"
              @sort-change="sortChanged = $event"
            />
          </div>

          <div class="flex-1 space-y-4">
            <!-- Error -->
            <div v-if="error" class="text-red-500">
              Có lỗi xảy ra: {{ error.message }}
            </div>

            <!-- Loading lần đầu -->
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

            <!-- Không có kết quả -->
            <template v-else-if="!loading && posts.length === 0">
              <div class="flex flex-col items-center justify-center py-16">
                <UIcon
                  name="i-heroicons-magnifying-glass"
                  class="mb-4 h-16 w-16 text-gray-400"
                />
                <h3
                  class="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300"
                >
                  Không tìm thấy bài viết
                </h3>
                <p class="text-gray-500 dark:text-gray-400">
                  Không có kết quả nào cho từ khóa "{{ route.query.q }}"
                </p>
                <UButton
                  variant="ghost"
                  color="primary"
                  class="mt-4"
                  @click="$router.push('/')"
                >
                  <UIcon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
                  Về trang chủ
                </UButton>
              </div>
            </template>

            <!-- Có bài viết -->
            <template v-else>
              <KeepAlive>
                <ArticleCard :articles="posts" />
              </KeepAlive>

              <!-- Skeleton load thêm -->
              <div
                v-if="loading && posts.length > 0"
                class="flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16"
              >
                <USkeleton
                  v-for="i in 3"
                  :key="i"
                  class="h-96 w-full rounded-lg"
                />
              </div>

              <!-- Hết bài viết -->
              <div
                v-else-if="
                  !loading && posts.length > 0 && !data?.pagination?.hasNext
                "
                class="mt-6 text-center text-gray-500 dark:text-gray-400"
              >
                <UIcon
                  name="i-heroicons-check-circle"
                  class="mx-auto mb-2 h-8 w-8"
                />
                <p>Bạn đã xem hết tất cả bài viết.</p>
              </div>
            </template>
          </div>
        </section>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
