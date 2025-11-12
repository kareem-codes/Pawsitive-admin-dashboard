<template>
  <teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeOnBackdrop && close()">
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            :class="[
              'bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto',
              sizeClasses
            ]">
            <!-- Header -->
            <div class="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ title }}
                </h3>
                <p v-if="subtitle" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ subtitle }}
                </p>
              </div>
              <button
                v-if="showClose"
                @click="close"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-6">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer || showDefaultFooter" class="p-6 border-t border-gray-200 dark:border-zinc-800">
              <slot name="footer">
                <div class="flex items-center justify-end gap-3">
                  <button
                    v-if="showCancel"
                    @click="close"
                    :disabled="loading"
                    class="px-6 py-2.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ cancelText }}
                  </button>
                  <button
                    v-if="showConfirm"
                    @click="$emit('confirm')"
                    :disabled="loading || confirmDisabled"
                    :class="[
                      'px-6 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                      confirmVariant === 'danger'
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white'
                        : confirmVariant === 'success'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                        : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white'
                    ]">
                    <span v-if="loading" class="flex items-center gap-2">
                      <Icon name="mdi:loading" class="w-4 h-4 animate-spin" />
                      {{ loadingText }}
                    </span>
                    <span v-else>{{ confirmText }}</span>
                  </button>
                </div>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full',
    default: 'md'
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  showDefaultFooter: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  showConfirm: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  confirmVariant: {
    type: String as () => 'primary' | 'danger' | 'success',
    default: 'primary'
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'confirm'])

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4'
  }
  return sizes[props.size]
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Close modal on Escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.modelValue) {
      close()
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
