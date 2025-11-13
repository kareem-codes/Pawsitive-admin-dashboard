<template>
  <div class="flex h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
    </div>

    <div class="m-auto z-10 w-full max-w-md px-4">
      <div class="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-zinc-800/50">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50 transform hover:scale-110 transition-transform">
            <Icon name="mdi:paw" class="w-12 h-12 text-white" />
          </div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {{ t('common.appName') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('common.appDescription') }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('auth.email') }}
            </label>
            <div class="relative">
              <Icon name="mdi:email-outline" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
                :placeholder="t('auth.emailPlaceholder')"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('auth.password') }}
            </label>
            <div class="relative">
              <Icon name="mdi:lock-outline" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
                :placeholder="t('auth.passwordPlaceholder')"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm flex items-center gap-2">
            <Icon name="mdi:alert-circle" class="w-5 h-5" />
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/50 transform hover:-translate-y-0.5"
          >
            <Icon v-if="loading" name="mdi:loading" class="animate-spin mr-2 w-5 h-5" />
            {{ loading ? t('auth.loggingIn') : t('auth.login') }}
          </button>
        </form>

        <!-- Demo Notice -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('auth.demoCredentials') }}
          </p>
        </div>
        <div class="flex gap-3">
          <button class="">{{ t('admin') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const { handleError } = useErrorHandler()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(form.email, form.password)
    router.push('/')
  } catch (err: any) {
    error.value = handleError(err, t('auth.loginError'))
  } finally {
    loading.value = false
  }
}
</script>
