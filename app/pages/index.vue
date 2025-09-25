<script setup>
const articles = [
  {
    id: 1,
    title: 'Getting Started with Nuxt UI',
    description: 'Learn how to use Nuxt UI in your projects',
    icon: 'i-mdi-palette',
    slug: 'getting-started-with-nuxt-ui',
  },
  {
    id: 2,
    title: 'Vue 3 Composition API',
    description: 'Master the Composition API in Vue 3',
    icon: 'i-mdi-vuejs',
    slug: 'vue-3-composition-api',
  },
]
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        description="Discover amazing articles about technology, design and more."
        :ui="{
          title: 'text-2xl md:text-5xl lg:text-6xl',
          description: 'text-lg',
        }"
      >
        <template #links>
          <UButton
            icon="i-mdi-arrow-right"
            label="Browse Articles"
            to="/articles"
            color="black"
            variant="solid"
          />
        </template>
      </UPageHeader>

      <UPageBody>
        <UPageGrid>
          <UPageCard
            v-for="article in articles"
            :key="article.id"
            :title="article.title"
            :description="article.description"
            :icon="article.icon"
            :to="`/articles/${article.slug}`"
          />
        </UPageGrid>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
