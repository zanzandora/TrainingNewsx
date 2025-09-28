<script setup>
import articles from '~/lib/data/mock-data.json'
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
                <h1 class="mb-2 text-3xl font-bold text-black dark:text-white">
                  Tuổi Trẻ Online
                </h1>
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
        </UPageBody>
      </UPage>
    </UContainer>
  </div>
</template>
