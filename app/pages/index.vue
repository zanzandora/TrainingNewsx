<script setup>
import articles from '~/lib/data/mock-data.json'

const links = ref([
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Link One',
  },
])
</script>

<template>
  <div>
    <UContainer>
      <UPage>
        <!-- Page title section -->
        <UPageHeader>
          <div class="py-4">
            <UContainer>
              <div class="space-y-1 text-center">
                <h1 class="mb-2 text-3xl font-bold text-white">
                  Tuổi Trẻ Online
                </h1>

                <UBreadcrumb
                  :items="links"
                  class="flex justify-center text-sm"
                />
              </div>
            </UContainer>
          </div>
        </UPageHeader>

        <div class="mx-auto mb-16 max-w-7xl">
          <ArticleCard
            v-bind="articles[0]"
            category="Technology"
            author-avatar="https://github.com/benjamincanac.png"
            :featured="true"
          />
        </div>

        <!-- Main  -->
        <UPageBody>
          <ArticleCard :articles="articles" />
          <!-- Load More Button  -->
          <div className="text-center mb-16">
            <UButton variant="outline" class="px-8 py-2"> Load More </UButton>
          </div>
        </UPageBody>
      </UPage>
    </UContainer>
  </div>
</template>
