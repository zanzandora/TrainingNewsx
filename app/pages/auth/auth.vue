<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const message = ref('')
const isError = ref(false)

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  message.value = ''
}

const handleSubmit = async () => {
  message.value = ''
  isError.value = false
  loading.value = true

  // Giả lập gọi API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (mode.value === 'login') {
    if (email.value === 'test@example.com' && password.value === '123456') {
      const loggedInUser = { email: email.value }
      localStorage.setItem('user', JSON.stringify(loggedInUser))
      message.value = 'Đăng nhập thành công!'
      await router.push('/')
    } else {
      message.value = 'Sai email hoặc mật khẩu.'
      isError.value = true
    }
  } else {
    if (password.value !== confirmPassword.value) {
      message.value = 'Mật khẩu không khớp!'
      isError.value = true
    } else {
      const newUser = { email: email.value }
      localStorage.setItem('user', JSON.stringify(newUser))
      message.value = 'Đăng ký thành công!'
      await router.push('/')
    }
  }

  loading.value = false
}
</script>

<template>
  <div
    class="auth-page flex min-h-screen items-center justify-center bg-gray-100"
  >
    <div class="auth-card w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-center text-2xl font-semibold">
        {{ mode === 'login' ? 'Đăng nhập' : 'Đăng ký' }}
      </h2>

      <p
        v-if="message"
        class="'mt-4 font-bold' mb-2 inline-block rounded px-2 py-1 text-center text-sm"
        :class="[
          isError
            ? 'border border-red-400 bg-red-100 text-red-700 shadow-sm shadow-red-200'
            : 'border border-green-400 bg-green-100 text-green-700 shadow-sm shadow-green-200',
        ]"
      >
        {{ message }}
      </p>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Mật khẩu"
          required
          class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />

        <input
          v-if="mode === 'register'"
          v-model="confirmPassword"
          type="password"
          placeholder="Xác nhận mật khẩu"
          required
          class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {{
            loading
              ? 'Đang xử lý...'
              : mode === 'login'
                ? 'Đăng nhập'
                : 'Đăng ký'
          }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm">
        {{ mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
        <button class="text-blue-600 hover:underline" @click="toggleMode">
          {{ mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập' }}
        </button>
      </p>

      <div
        v-if="user"
        class="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-700"
      >
        <p><strong>Người dùng:</strong> {{ user.email }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: url('/news-background.png') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-card {
  background: rgba(255, 255, 255, 0.735);
  padding: 2rem;
  border-radius: 1rem;
  color: rgb(92, 92, 92);
}
</style>
