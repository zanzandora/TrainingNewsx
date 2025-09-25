<template>
  <div class="flex min-h-screen flex-col">
    <LazyBaseNavigation />
    <main class="flex-1 px-2 md:px-4 lg:px-8 xl:px-32">
      <slot />
    </main>
  </div>
</template>
