<template>
  <div class="animate-fade-in">
    <!-- Header with better spacing and animation -->
    <div class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
        {{ t('nav.dashboard') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
        {{ t('dashboard.welcome') }}, <span class="font-semibold text-indigo-600 dark:text-indigo-400">{{ authStore.user?.name }}</span>!
      </p>
    </div>

    <!-- Stats Overview with stagger animation -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <div v-for="(stat, index) in statsCards" :key="index" class="animate-slide-up" :style="{ animationDelay: `${index * 100}ms` }">
        <StatCard
          :title="t(stat.titleKey)"
          :value="stats[stat.key] || 0"
          :icon="stat.icon"
          :color="stat.color"
          :loading="loading"
          :change="stat.change"
        />
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-shadow duration-300">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="mdi:lightning-bolt" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {{ t('dashboard.quickActions') }}
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NuxtLink
            to="/appointments/create"
            class="group relative flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 overflow-hidden border border-indigo-100 dark:border-indigo-900"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            <Icon name="mdi:calendar-plus" class="w-6 h-6 ltr:mr-2 rtl:ml-2 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span class="font-semibold text-gray-900 dark:text-white text-sm">{{ t('dashboard.newAppointment') }}</span>
          </NuxtLink>
          <NuxtLink
            to="/pets/create"
            class="group relative flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 overflow-hidden border border-purple-100 dark:border-purple-900"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            <Icon name="mdi:paw" class="w-6 h-6 ltr:mr-2 rtl:ml-2 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            <span class="font-semibold text-gray-900 dark:text-white text-sm">{{ t('dashboard.addPet') }}</span>
          </NuxtLink>
          <NuxtLink
            to="/invoices/create"
            class="group relative flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 overflow-hidden border border-emerald-100 dark:border-emerald-900"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            <Icon name="mdi:receipt-text" class="w-6 h-6 ltr:mr-2 rtl:ml-2 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <span class="font-semibold text-gray-900 dark:text-white text-sm">{{ t('dashboard.createInvoice') }}</span>
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="group relative flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 overflow-hidden border border-amber-100 dark:border-amber-900"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            <Icon name="mdi:package-variant" class="w-6 h-6 ltr:mr-2 rtl:ml-2 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            <span class="font-semibold text-gray-900 dark:text-white text-sm">{{ t('dashboard.manageStock') }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Activity -->
            <!-- Recent Activity -->
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-shadow duration-300">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="mdi:clock-outline" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {{ t('dashboard.recentActivity') }}
          </h2>
        </div>
        <div class="space-y-3">
          <div v-if="loading" class="text-center py-12">
            <Icon name="mdi:loading" class="w-10 h-10 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading activities...</p>
          </div>
          <div v-else-if="recentActivity.length === 0" class="text-center py-12">
            <Icon name="mdi:inbox" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t('dashboard.noActivity') }}</p>
          </div>
          <div
            v-else
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-start ltr:space-x-3 rtl:space-x-3 rtl:space-x-reverse p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon :name="activity.icon" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ formatTimestamp(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Appointments -->
    <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-shadow duration-300">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon name="mdi:calendar-today" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          {{ t('dashboard.todayAppointments') }}
        </h2>
        <NuxtLink
          to="/appointments"
          class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all group"
        >
          {{ t('common.viewAll') }}
          <Icon name="mdi:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>
      </div>
      <div v-if="loading" class="text-center py-12">
        <Icon name="mdi:loading" class="w-10 h-10 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading appointments...</p>
      </div>
      <div v-else-if="todayAppointments.length === 0" class="text-center py-12">
        <Icon name="mdi:calendar-blank" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t('dashboard.noAppointments') }}</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="appointment in todayAppointments"
          :key="appointment.id"
          class="group flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-gray-100 dark:border-zinc-800 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-md transition-all duration-200 gap-3 cursor-pointer"
        >
          <div class="flex items-center ltr:space-x-3 rtl:space-x-3 rtl:space-x-reverse">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shadow-sm group-hover:scale-110 transition-transform">
                <Icon name="mdi:paw" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-gray-900 dark:text-white text-base truncate">{{ appointment.petName }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                <Icon name="mdi:account" class="w-3.5 h-3.5" />
                {{ appointment.ownerName }} 
                <span class="mx-1">•</span>
                <Icon name="mdi:stethoscope" class="w-3.5 h-3.5" />
                {{ appointment.type }}
              </p>
            </div>
          </div>
          <div class="flex items-center justify-between sm:justify-end ltr:pl-12 rtl:pr-12 sm:ltr:pl-0 sm:rtl:pr-0 gap-3">
            <div class="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <Icon name="mdi:clock-outline" class="w-4 h-4 text-gray-400" />
              {{ appointment.time }}
            </div>
            <span
              :class="{
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800': appointment.status === 'confirmed',
                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800': appointment.status === 'pending',
                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 ring-1 ring-gray-200 dark:ring-gray-700': appointment.status === 'completed'
              }"
              class="px-3 py-1.5 rounded-lg text-xs font-bold capitalize"
            >
              {{ appointment.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardStats, Appointment, Activity } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const authStore = useAuthStore()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()

const loading = ref(true)
const stats = ref<DashboardStats>({
  todayAppointments: 0,
  activePets: 0,
  pendingBills: 0,
  lowStockItems: 0
})

const statsCards = [
  {
    key: 'todayAppointments' as keyof DashboardStats,
    titleKey: 'dashboard.todayAppointments',
    icon: 'mdi:calendar-clock',
    color: 'flex bg-gradient-to-br from-indigo-500 to-purple-600',
    change: 12
  },
  {
    key: 'pendingBills' as keyof DashboardStats,
    titleKey: 'dashboard.pendingBills',
    icon: 'mdi:currency-usd',
    color: 'flex bg-gradient-to-br from-emerald-500 to-teal-600',
    change: -5
  },
  {
    key: 'lowStockItems' as keyof DashboardStats,
    titleKey: 'dashboard.lowStockItems',
    icon: 'mdi:package-variant',
    color: 'flex bg-gradient-to-br from-amber-500 to-orange-600',
    change: 3
  },
  {
    key: 'activePets' as keyof DashboardStats,
    titleKey: 'dashboard.activePets',
    icon: 'mdi:paw',
    color: 'flex bg-gradient-to-br from-rose-500 to-pink-600',
    change: 8
  }
]

const todayAppointments = ref<any[]>([])
const recentActivity = ref<Activity[]>([])

const formatTimestamp = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = Math.floor((now.getTime() - time.getTime()) / 1000)

  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

const fetchDashboardData = async () => {
  loading.value = true
  try {
    // Fetch stats
    const statsResponse = await $apiService.dashboard.getStats()
    
    if (statsResponse?.data) {
      const data = statsResponse.data
      
      // Map backend response to frontend stats structure
      // Backend returns different structure based on user role
      if (data.today) {
        // Staff dashboard structure
        stats.value = {
          todayAppointments: data.appointments?.today || data.today?.appointments || 0,
          activePets: data.pets?.total || 0,
          pendingBills: data.revenue?.unpaid_total || 0,
          lowStockItems: data.inventory?.low_stock_count || 0
        }
      } else if (data.pets || data.appointments) {
        // Owner dashboard structure
        stats.value = {
          todayAppointments: data.appointments?.today || 0,
          activePets: data.pets?.total || data.pets?.active || 0,
          pendingBills: data.invoices?.unpaid || 0,
          lowStockItems: 0 // Owners don't see stock
        }
      }
    }

    // Fetch today's appointments
    const appointmentsResponse = await $apiService.appointments.getTodayAppointments()
    
    if (appointmentsResponse?.data) {
      todayAppointments.value = appointmentsResponse.data.map((apt: Appointment) => ({
        id: apt.id,
        petName: apt.pet?.name || 'Unknown',
        ownerName: apt.owner?.name || 'Unknown',
        type: apt.reason,
        time: formatTime(apt.appointment_time || apt.appointment_date),
        status: apt.status
      }))
    }

    // Fetch recent activity
    const activityResponse = await $apiService.dashboard.getRecentActivity()
    if (activityResponse?.data) {
      recentActivity.value = activityResponse.data
    }
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error)
    const errorMessage = handleError(error)
    console.error('Formatted error:', errorMessage)
  } finally {
    loading.value = false
  }
}

const formatTime = (datetime: string) => {
  if (!datetime) return 'N/A'
  
  try {
    const date = new Date(datetime)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  } catch (e) {
    return datetime
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
