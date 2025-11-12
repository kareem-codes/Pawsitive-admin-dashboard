<template>
  <header class="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800 shadow-sm">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Mobile menu button -->
        <button
          @click="$emit('toggleMobileMenu')"
          class="lg:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-zinc-800 dark:hover:to-zinc-800/50 transition-all duration-200 hover:shadow-md"
        >
          <Icon name="mdi:menu" class="w-6 h-6" />
        </button>

        <!-- Search -->
        <div class="flex-1 max-w-2xl ltr:mx-4 rtl:mx-4 hidden sm:block">
          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity duration-300"></div>
            <Icon name="mdi:magnify" class="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-all duration-200 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 group-focus-within:scale-110 z-10" />
            <input
              type="text"
              :placeholder="t('common.search') + '...'"
              class="relative w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white transition-all duration-200 placeholder:text-sm hover:border-gray-300 dark:hover:border-zinc-600 shadow-sm focus:shadow-md"
            />
          </div>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center ltr:space-x-2 rtl:space-x-2 rtl:space-x-reverse">
          <!-- Language Switcher -->
          <div class="relative">
            <button
              @click="showLangMenu = !showLangMenu"
              class="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-zinc-800 dark:hover:to-zinc-800/50 transition-all duration-200 flex items-center gap-2 hover:shadow-md"
              :title="t('common.language')"
            >
              <Icon name="mdi:translate" class="w-5 h-5" />
              <span class="text-sm font-semibold hidden sm:inline">{{ currentLocale.name }}</span>
            </button>
            
            <!-- Language Dropdown -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div 
                v-if="showLangMenu"
                class="absolute ltr:right-0 rtl:left-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2 z-50 overflow-hidden"
              >
                <button
                  v-for="loc in availableLocales"
                  :key="loc.code"
                  @click="switchLocale(loc.code)"
                  class="w-full px-4 py-2.5 text-sm ltr:text-left rtl:text-right hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200 flex items-center justify-between group"
                  :class="locale === loc.code ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-gray-700 dark:text-gray-300'"
                >
                  <span class="flex items-center gap-2">
                    <Icon :name="loc.code === 'ar' ? 'emojione:flag-for-saudi-arabia' : 'emojione:flag-for-united-states'" class="w-5 h-5" />
                    {{ loc.name }}
                  </span>
                  <Icon v-if="locale === loc.code" name="mdi:check-circle" class="w-5 h-5" />
                </button>
              </div>
            </Transition>
          </div>

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-zinc-800 dark:hover:to-zinc-800/50 transition-all duration-200 hover:shadow-md hover:scale-105"
            :title="t('common.theme')"
          >
            <Icon :name="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
          </button>

          <!-- Notifications -->
          <button
            class="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-zinc-800 dark:hover:to-zinc-800/50 transition-all duration-200 hidden sm:block hover:shadow-md"
            :title="t('common.notifications')"
          >
            <Icon name="mdi:bell" class="w-5 h-5" />
            <span class="absolute top-1.5 ltr:right-1.5 rtl:left-1.5 flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500 ring-2 ring-white dark:ring-zinc-900"></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core'

defineEmits<{
  toggleMobileMenu: []
}>()

const { t, locale, setLocale } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const showLangMenu = ref(false)

const availableLocales = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' }
]

const currentLocale = computed(() => {
  return availableLocales.find(l => l.code === locale.value) || availableLocales[0]
})

const toggleTheme = () => {
  colorMode.value = isDark.value ? 'light' : 'dark'
}

const switchLocale = (code: string) => {
  setLocale(code as 'en' | 'ar')
  showLangMenu.value = false
  
  // Update HTML dir attribute for RTL support
  const html = document.documentElement
  html.setAttribute('dir', code === 'ar' ? 'rtl' : 'ltr')
  html.setAttribute('lang', code)
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showLangMenu.value = false
    }
  })
})
</script>
