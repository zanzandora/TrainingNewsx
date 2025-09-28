<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

/**
 * Format pubDate về dạng dd/mm/yyyy
 */
const formattedDate = computed(() => {
  const d = new Date(props.item.pubDate)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN')
})
</script>

<template>
  <div
    class="flex cursor-pointer items-start gap-3 border-b border-gray-200 p-3 hover:bg-gray-50"
  >
    <!-- Hình ảnh -->
    <div class="h-16 w-24 flex-shrink-0 overflow-hidden rounded">
      <img
        :src="item.image"
        alt="thumbnail"
        class="h-full w-full object-cover"
      />
    </div>

    <!-- Nội dung -->
    <div class="flex-1">
      <h3 class="line-clamp-2 font-semibold text-gray-900">
        {{ item.title }}
      </h3>
      <p class="mt-1 text-sm text-gray-600">
        {{ item.author.name }}
      </p>
      <p class="mt-0.5 text-xs text-gray-400">
        {{ formattedDate }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Giới hạn text title xuống 2 dòng, nếu dài thì thêm dấu ... */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
