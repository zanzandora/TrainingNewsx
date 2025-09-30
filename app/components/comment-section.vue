<script setup lang="ts">
import { ref } from 'vue'

type Comment = {
  id: number
  author: string
  content: string
  createdAt: Date
  parentId?: number
  replies?: Comment[]
}

// const props = defineProps<{
//   postId: string
// }>()

const comments = ref<Comment[]>([])
const newComment = ref('')
const newReplies = ref<Record<number, string>>({})
const authorName = ref('')
const replyingTo = ref<number | null>(null)

// Generate initials from author name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Format date to relative time
const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}

// Add a new comment or reply
const addComment = (parentId?: number) => {
  if (!newComment.value.trim() || !authorName.value.trim()) return

  const newCommentObj: Comment = {
    id: Date.now(),
    author: authorName.value,
    content: newComment.value,
    createdAt: new Date(),
    parentId,
    replies: [],
  }

  // Add new top-level comment
  comments.value.push(newCommentObj)

  // Reset form
  newComment.value = ''
}

// Add a reply
const addReply = (parentId: number) => {
  const replyContent = newReplies.value[parentId] || ''
  if (!replyContent.trim() || !authorName.value.trim()) return

  const replyObj: Comment = {
    id: Date.now(),
    author: authorName.value,
    content: replyContent,
    createdAt: new Date(),
    parentId,
  }

  const parentComment = comments.value.find((c) => c.id === parentId)
  if (parentComment) {
    parentComment.replies = [...(parentComment.replies || []), replyObj]
  }

  // reset state
  newReplies.value[parentId] = ''
  replyingTo.value = null
}

// Start replying to a comment
const startReply = (commentId: number) => {
  replyingTo.value = commentId
  if (!newReplies.value[commentId]) newReplies.value[commentId] = ''
}

// Cancel reply
const cancelReply = (commentId: number) => {
  replyingTo.value = null
  newReplies.value[commentId] = ''
}
</script>

<template>
  <div class="mt-8">
    <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
      Bình luận
    </h2>

    <!-- Main Comment Form -->
    <div class="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div class="flex items-start space-x-4">
        <!-- Avatar Area -->
        <div class="flex-shrink-0">
          <div
            class="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white"
            :style="{
              backgroundColor: authorName
                ? `#${authorName
                    .split('')
                    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
                    .toString(16)
                    .slice(-6)}`
                : '#4F46E5',
            }"
          >
            {{ authorName ? getInitials(authorName) : '?' }}
          </div>
        </div>

        <!-- Input Area -->
        <div
          class="w-full max-w-2xl rounded-2xl border border-gray-200 p-5 shadow-sm"
        >
          <!-- Name Input -->
          <div class="mb-4">
            <UInput
              v-model="authorName"
              placeholder="Tên của bạn"
              icon="i-heroicons-user-circle"
              size="lg"
              class="w-full"
            />
          </div>

          <!-- Comment Input -->
          <div class="mb-4">
            <UTextarea
              v-model="newComment"
              placeholder="Viết bình luận của bạn..."
              :rows="4"
              class="w-full"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Nhấn Enter để xuống dòng</span>
            <UButton
              color="primary"
              :disabled="!newComment.trim() || !authorName.trim()"
              class="px-6"
              @click="() => addComment()"
            >
              <UIcon name="i-heroicons-paper-airplane" class="mr-2 h-4 w-4" />
              Gửi
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <div class="space-y-6">
      <template v-if="comments.length">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <!-- Comment Header -->
          <div class="mb-3 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <!-- Avatar -->
              <div
                class="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white"
                :style="{
                  backgroundColor: `#${comment.id.toString(16).slice(-6)}`,
                }"
              >
                {{ getInitials(comment.author) }}
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ comment.author }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatDate(comment.createdAt) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Comment Content -->
          <div class="mb-3 text-gray-700 dark:text-gray-300">
            {{ comment.content }}
          </div>

          <!-- Comment Actions -->
          <div class="flex items-center space-x-2">
            <UButton
              v-if="replyingTo !== comment.id"
              variant="ghost"
              color="neutral"
              size="sm"
              @click="startReply(comment.id)"
            >
              <UIcon name="i-heroicons-arrow-uturn-left" class="mr-1 h-4 w-4" />
              Trả lời
            </UButton>
          </div>

          <!-- Reply Form -->
          <div v-if="replyingTo === comment.id" class="mt-4">
            <div
              class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700"
            >
              <!-- Reply Input -->
              <UTextarea
                v-model="newReplies[comment.id]"
                placeholder="Viết câu trả lời của bạn..."
                :rows="3"
                class="mb-3 w-full"
              />

              <!-- Action Buttons -->
              <div class="flex items-center justify-end space-x-2">
                <UButton
                  color="primary"
                  size="sm"
                  :disabled="
                    !newReplies[comment.id]?.trim() || !authorName.trim()
                  "
                  @click="() => addReply(comment.id)"
                >
                  <UIcon
                    name="i-heroicons-paper-airplane"
                    class="mr-1 h-4 w-4"
                  />
                  Gửi
                </UButton>

                <UButton
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  @click="() => cancelReply(comment.id)"
                >
                  Hủy
                </UButton>
              </div>
            </div>
          </div>

          <!-- Replies -->
          <div
            v-if="comment.replies && comment.replies.length > 0"
            class="mt-4 space-y-4"
          >
            <div
              v-for="reply in comment.replies"
              :key="reply.id"
              class="ml-6 border-l-2 border-gray-100 pl-4 dark:border-gray-700"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  {{ getInitials(reply.author) }}
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ reply.author }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatDate(reply.createdAt) }}
                  </div>
                </div>
              </div>
              <div class="mt-2 text-gray-700 dark:text-gray-300">
                {{ reply.content }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="text-center text-gray-500">
        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
      </div>
    </div>
  </div>
</template>
