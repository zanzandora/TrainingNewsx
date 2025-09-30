<script setup>
import articles from '~/lib/data/mock-data.json'
</script>

<template>
  <div>
    <UContainer>
      <UPage>
        <UPageHeader class="pl-5" title="Tìm kiếm" />
        <!-- Main  -->
        <UPageBody>
          <section class="flex w-full">
            <div class="hidden w-full lg:block lg:w-1/5">
              <LazySideMenu />
            </div>
            <div class="flex-1">
              <ArticleCard :articles="articles" />
            </div>
          </section>
        </UPageBody>
      </UPage>
    </UContainer>
  </div>
</template>
