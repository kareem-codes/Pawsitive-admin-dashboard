<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
    <TransitionGroup
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-x-full opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div
        v-for="(toast, index) in toasts"
        :key="index"
        :class="[
          'flex items-start gap-3 p-4 rounded-lg shadow-lg border',
          'backdrop-blur-sm min-w-[320px]',
          toastClasses[toast.type as ToastType]
        ]"
      >
        <div class="flex-shrink-0">
          <Icon 
            :name="toastIcons[toast.type as ToastType]" 
            :class="[
              'w-5 h-5',
              toast.type === 'success' ? 'text-green-600 dark:text-green-400' : '',
              toast.type === 'error' ? 'text-red-600 dark:text-red-400' : '',
              toast.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : '',
              toast.type === 'info' ? 'text-blue-600 dark:text-blue-400' : ''
            ]"
          />
        </div>
        
        <div class="flex-1 min-w-0">
          <p v-if="toast.title" class="font-semibold text-sm mb-1">
            {{ toast.title }}
          </p>
          <p class="text-sm">
            {{ toast.message }}
          </p>
        </div>
        
        <button
          @click="removeToast(index)"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <Icon name="mdi:close" class="w-5 h-5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { toasts } = useToast()

type ToastType = 'success' | 'error' | 'warning' | 'info'

const toastClasses: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-800 dark:text-green-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200'
}

const toastIcons: Record<ToastType, string> = {
  success: 'mdi:check-circle',
  error: 'mdi:alert-circle',
  warning: 'mdi:alert',
  info: 'mdi:information'
}

const removeToast = (index: number) => {
  toasts.value.splice(index, 1)
}
</script>
