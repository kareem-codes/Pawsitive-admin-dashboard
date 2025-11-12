<template>
  <div
    v-if="!isApiHealthy && errorMessage"
    class="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 shadow-lg"
  >
    <div class="max-w-7xl mx-auto">
      <div class="flex items-start gap-3">
        <Icon name="mdi:alert-circle" class="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm">API Connection Error</p>
          <p class="text-xs mt-1 whitespace-pre-line">{{ errorMessage }}</p>
          <div class="mt-2 text-xs">
            <p>API Endpoint: <code class="bg-red-700 px-1 py-0.5 rounded">{{ apiBase }}</code></p>
          </div>
        </div>
        <button
          @click="checkHealth"
          :disabled="isChecking"
          class="flex-shrink-0 px-3 py-1 bg-red-700 hover:bg-red-800 rounded text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <Icon v-if="isChecking" name="mdi:loading" class="w-4 h-4 animate-spin" />
          <span v-else>Retry</span>
        </button>
        <button
          @click="dismiss"
          class="flex-shrink-0 p-1 hover:bg-red-700 rounded transition-colors"
        >
          <Icon name="mdi:close" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { isApiHealthy, isChecking, errorMessage, checkApiHealth } = useApiHealth()
const dismissed = ref(false)

const apiBase = computed(() => config.public.apiBase as string)

const checkHealth = async () => {
  dismissed.value = false
//   await checkApiHealth()
}

const dismiss = () => {
  dismissed.value = true
}

// Check API health on mount
// onMounted(() => {
//   checkApiHealth()
// })

// // Auto-retry every 30 seconds if API is down
// const retryInterval = setInterval(() => {
//   if (!isApiHealthy.value && !dismissed.value) {
//     checkApiHealth()
//   }
// }, 30000)

// onUnmounted(() => {
//   clearInterval(retryInterval)
// })
</script>
