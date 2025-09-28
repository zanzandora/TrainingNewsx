<template>
  <div class="flex min-h-screen flex-col">
    <lazy-common-base-navigation />
    <main class="flex-1 px-4 md:px-8 lg:px-16 xl:px-64">
      <slot />
    </main>
    <CommonFooter />
    <SearchModal />
  </div>
</template>
