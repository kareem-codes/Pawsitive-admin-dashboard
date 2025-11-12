<template>
  <aside
    class="fixed inset-y-0 ltr:left-0 rtl:right-0 w-64 bg-white dark:bg-zinc-900 ltr:border-r rtl:border-l border-gray-200 dark:border-zinc-800 transition-transform duration-300 z-50"
    :class="[
      isMobileOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full',
      'lg:!translate-x-0'
    ]">
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="flex items-center h-16 px-6 border-b border-gray-200 dark:border-zinc-800 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        <Icon name="mdi:paw" class="w-8 h-8 text-white ltr:mr-3 rtl:ml-3 animate-pulse" />
        <span class="text-xl font-bold text-white relative z-10">{{ t('common.appName') }}</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group relative overflow-hidden"
          :class="isActive(item.href)
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-zinc-800 dark:hover:to-zinc-800/50 hover:shadow-md'">
          <Icon
            :name="item.icon"
            class="w-5 h-5 ltr:mr-3 rtl:ml-3 transition-transform group-hover:scale-110"
            :class="isActive(item.href) ? 'text-white' : 'text-gray-500 dark:text-gray-400'" />
          {{ t(item.label) }}
        </NuxtLink>
      </nav>

      <!-- User Menu -->
      <div class="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900/50 dark:to-zinc-900">
        <div class="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 group">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-zinc-800 shadow-lg group-hover:scale-105 transition-transform">
              <Icon name="mdi:account" class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">{{ authStore.user?.role }}</p>
          </div>
          <button
            @click="handleLogout"
            class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110"
            :title="t('common.logout')">
            <Icon name="mdi:logout" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  isMobileOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { hasPermission, hasAnyPermission, hasRole } = usePermissions()

const allNavigation = [
  { name: 'dashboard', href: '/', icon: 'mdi:view-dashboard', label: 'nav.dashboard', permission: null },
  { name: 'appointments', href: '/appointments', icon: 'mdi:calendar-clock', label: 'nav.appointments', permission: 'view appointments' },
  { name: 'pets', href: '/pets', icon: 'mdi:paw', label: 'nav.pets', permission: 'view pets' },
  { name: 'owners', href: '/owners', icon: 'mdi:account-group', label: 'nav.owners', permission: 'view owners' },
  { name: 'medicalRecords', href: '/medical-records', icon: 'mdi:file-document', label: 'nav.medicalRecords', permission: 'view medical records' },
  { name: 'invoices', href: '/invoices', icon: 'mdi:receipt', label: 'nav.invoices', permission: 'view invoices' },
  { name: 'products', href: '/products', icon: 'mdi:package-variant', label: 'nav.products', permission: 'view products' },
  { name: 'pos', href: '/pos', icon: 'mdi:cash-register', label: 'nav.pos', permission: 'access pos' },
  { name: 'reports', href: '/reports', icon: 'mdi:chart-bar', label: 'nav.reports', permission: 'view reports' },
  { name: 'settings', href: '/settings', icon: 'mdi:cog', label: 'nav.settings', permission: 'view settings' },
]

// Filter navigation based on user permissions
const navigation = computed(() => {
  return allNavigation.filter(item => {
    // If no permission required or user is admin, show the item
    if (!item.permission || hasRole('admin')) {
      return true
    }
    // Check if user has the required permission
    return hasPermission(item.permission)
  })
})

const isActive = (href: string) => {
  if (href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(href)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
