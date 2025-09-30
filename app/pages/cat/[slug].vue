<script setup lang="ts">
import type { PostsByCategoryResponse } from '~/types/api'
import type { Post } from '~/types/article'

const page = ref(1)
const limit = 9
const allPosts = ref<Post[]>([])
const route = useRoute()
const query = computed(() => ({
  limit,
  page: page.value,
}))
const slug = Array.isArray(route.params.slug)
  ? (route.params.slug[0] ?? 'trang-chu')
  : (route.params.slug ?? 'trang-chu')
const title =
  (route.query.t as string) || slug.replace(/-/g, ' ').toLocaleUpperCase()

// Create a more friendly category name mapping
const categoryNames: Record<string, string> = {
  'the-thao': 'Thể thao',
  'thoi-su': 'Thời sự',
  'the-gioi': 'Thế giới',
  'kinh-te': 'Kinh tế',
  'giao-duc': 'Giáo dục',
  'cong-nghe': 'Công nghệ',
  'suc-khoe': 'Sức khỏe',
  'van-hoa': 'Văn hóa',
  'du-lich': 'Du lịch',
  'giai-tri': 'Giải trí',
}

const displayTitle = computed(() => categoryNames[slug] || title || 'Danh mục')

// Set page title and meta
useSeoMeta({
  title: `${displayTitle.value} - Tin tức `,
  description: `Đọc các bài viết mới nhất về ${displayTitle.value.toLowerCase()}. Cập nhật tin tức nóng hổi và đáng chú ý nhất.`,
  ogTitle: `${displayTitle.value} - Tin tức`,
  ogDescription: `Tin tức ${displayTitle.value.toLowerCase()} mới nhất và đáng tin cậy`,
})

// Debug logs
console.warn('Cat page slug:', slug)
console.warn('Cat page query:', query.value)

const { data, execute, loading, error } = useFetchData<PostsByCategoryResponse>(
  '/post/category/:slug',
  {
    params: { slug },
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
    if (loading.value) {
      return
    }
    if (!data.value?.pagination?.hasNext) {
      return
    }

    page.value++

    await execute()
  },
  {
    distance: 100,
    canLoadMore: () => {
      const canLoad = data.value?.pagination?.hasNext === true && !loading.value
      console.warn('Can load more?', canLoad, {
        hasNext: data.value?.pagination?.hasNext,
        loading: loading.value,
      })
      return canLoad
    },
  },
)
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader>
        <div class="py-6">
          <div class="space-y-3 text-center">
            <h1
              class="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white"
            >
              {{ displayTitle }}
            </h1>
            <p class="text-base text-gray-600 md:text-lg dark:text-gray-300">
              Khám phá các tin tức nóng hổi và cập nhật mới nhất
            </p>
          </div>
        </div>
      </UPageHeader>
      <UPageBody>
        <section class="flex w-full">
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
