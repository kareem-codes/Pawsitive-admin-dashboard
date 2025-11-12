<template>
  <div class="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 dark:border-zinc-800 group hover:-translate-y-1">
    <!-- Background Gradient Effect -->
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="[bgGradient]"></div>
    
    <div class="relative flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 truncate">{{ title }}</p>
        <div class="flex items-baseline gap-2">
          <p v-if="!loading" class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">{{ value }}</p>
          <div v-else class="h-8 w-20 bg-gray-200 dark:bg-zinc-700 rounded-lg animate-pulse"></div>
          <span v-if="!loading && change !== undefined && change !== null" :class="[changeColor, 'text-xs sm:text-sm font-semibold flex items-center gap-1']">
            <Icon :name="change > 0 ? 'mdi:arrow-up' : 'mdi:arrow-down'" class="w-4 h-4" />
            {{ Math.abs(change) }}%
          </span>
        </div>
      </div>
      <div :class="[color, 'p-3 sm:p-4 rounded-2xl transform transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg flex-shrink-0 ltr:ml-3 rtl:mr-3']">
        <Icon :name="icon" class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  value: number | string
  icon: string
  color: string
  loading?: boolean
  change?: number
}>()

const bgGradient = computed(() => {
  const gradients: Record<string, string> = {
    'bg-gradient-to-br from-indigo-500 to-purple-600': 'bg-gradient-to-br from-indigo-500/5 to-purple-600/5',
    'bg-gradient-to-br from-emerald-500 to-teal-600': 'bg-gradient-to-br from-emerald-500/5 to-teal-600/5',
    'bg-gradient-to-br from-amber-500 to-orange-600': 'bg-gradient-to-br from-amber-500/5 to-orange-600/5',
    'bg-gradient-to-br from-rose-500 to-pink-600': 'bg-gradient-to-br from-rose-500/5 to-pink-600/5',
  }
  return gradients[props.color] || 'bg-gradient-to-br from-gray-500/5 to-gray-600/5'
})

const changeColor = computed(() => {
  if (!props.change) return ''
  return props.change > 0 
    ? 'text-emerald-600 dark:text-emerald-400' 
    : 'text-rose-600 dark:text-rose-400'
})
</script>
