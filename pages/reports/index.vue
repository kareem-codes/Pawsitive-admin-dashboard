<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {{ t('nav.reports') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('reports.subtitle') }}</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="exportReport('pdf')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
          <Icon name="mdi:file-pdf-box" class="w-5 h-5" />
          {{ t('reports.exportPdf') }}
        </button>
        <button
          @click="exportReport('excel')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
          <Icon name="mdi:file-excel" class="w-5 h-5" />
          {{ t('reports.exportExcel') }}
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
      <Icon name="mdi:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
      <div class="flex-1">
        <h3 class="text-sm font-semibold text-red-800 dark:text-red-300">{{ t('common.error') }}</h3>
        <p class="text-sm text-red-700 dark:text-red-400 mt-1">{{ error }}</p>
      </div>
      <button @click="error = null" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
        <Icon name="mdi:close" class="w-5 h-5" />
      </button>
    </div>

    <!-- Date Range Filter -->
    <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 dark:border-zinc-800">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('reports.dateFrom') }}
          </label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
            @change="fetchReports" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('reports.dateTo') }}
          </label>
          <input
            v-model="filters.dateTo"
            type="date"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
            @change="fetchReports" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('reports.period') }}
          </label>
          <select
            v-model="filters.period"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
            @change="setPeriod">
            <option value="custom">{{ t('reports.custom') }}</option>
            <option value="today">{{ t('reports.today') }}</option>
            <option value="week">{{ t('reports.thisWeek') }}</option>
            <option value="month">{{ t('reports.thisMonth') }}</option>
            <option value="year">{{ t('reports.thisYear') }}</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="refreshReports"
            class="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
            <Icon name="mdi:refresh" class="w-5 h-5" />
            {{ t('common.refresh') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <Icon name="mdi:loading" class="w-12 h-12 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">{{ t('reports.loading') }}</p>
    </div>

    <div v-else>
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-800">
          <div class="flex items-center justify-between mb-2">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Icon name="mdi:currency-usd" class="w-6 h-6 text-white" />
            </div>
            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              {{ metrics.revenueChange >= 0 ? '+' : '' }}{{ metrics.revenueChange }}%
            </span>
          </div>
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ t('reports.totalRevenue') }}</h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ metrics.totalRevenue.toFixed(2) }}</p>
        </div>

        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl shadow-lg p-6 border border-emerald-100 dark:border-emerald-800">
          <div class="flex items-center justify-between mb-2">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Icon name="mdi:calendar-check" class="w-6 h-6 text-white" />
            </div>
            <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
              {{ metrics.appointmentsChange >= 0 ? '+' : '' }}{{ metrics.appointmentsChange }}%
            </span>
          </div>
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ t('reports.totalAppointments') }}</h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics.totalAppointments }}</p>
        </div>

        <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-purple-800">
          <div class="flex items-center justify-between mb-2">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Icon name="mdi:paw" class="w-6 h-6 text-white" />
            </div>
            <span class="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
              {{ metrics.petsChange >= 0 ? '+' : '' }}{{ metrics.petsChange }}%
            </span>
          </div>
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ t('reports.newPets') }}</h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics.newPets }}</p>
        </div>

        <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl shadow-lg p-6 border border-amber-100 dark:border-amber-800">
          <div class="flex items-center justify-between mb-2">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Icon name="mdi:account-multiple" class="w-6 h-6 text-white" />
            </div>
            <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
              {{ metrics.clientsChange >= 0 ? '+' : '' }}{{ metrics.clientsChange }}%
            </span>
          </div>
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ t('reports.newClients') }}</h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics.newClients }}</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Revenue Chart -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="mdi:chart-line" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {{ t('reports.revenueOverview') }}
          </h3>
          <div v-if="revenueChartData" class="h-64">
            <ChartsLineChart :data="revenueChartData" />
          </div>
          <div v-else class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div class="text-center">
              <Icon name="mdi:chart-bar" class="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p>{{ t('common.noData') }}</p>
            </div>
          </div>
        </div>

        <!-- Appointments Chart -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="mdi:chart-donut" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            {{ t('reports.appointmentsByStatus') }}
          </h3>
          <div v-if="appointmentsChartData" class="h-64">
            <ChartsDoughnutChart :data="appointmentsChartData" />
          </div>
          <div v-else class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div class="text-center">
              <Icon name="mdi:chart-donut" class="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p>{{ t('common.noData') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Services -->
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800 mb-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Icon name="mdi:star" class="w-6 h-6 text-amber-500" />
          {{ t('reports.popularServices') }}
        </h3>
        <div v-if="popularServices.length === 0" class="text-center py-12">
          <Icon name="mdi:chart-bar-stacked" class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p class="text-gray-500 dark:text-gray-400">{{ t('common.noData') }}</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="service in popularServices" :key="service.name" class="flex items-center gap-4">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ service.name }}</span>
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">{{ service.count }} {{ t('reports.times') }}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                <div
                  class="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  :style="{ width: `${popularServices.length > 0 && popularServices[0] ? (service.count / popularServices[0].count) * 100 : 0}%` }"></div>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-gray-900 dark:text-white">${{ service.revenue.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-zinc-800">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="mdi:receipt-text" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {{ t('reports.recentTransactions') }}
            </h3>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('reports.invoiceBasedRevenue') }}</span>
          </div>
        </div>
        <div v-if="recentTransactions.length === 0" class="text-center py-12">
          <Icon name="mdi:receipt-text-outline" class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p class="text-gray-500 dark:text-gray-400">{{ t('common.noData') }}</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{{ t('common.date') }}</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{{ t('reports.transactionDescription') }}</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{{ t('invoices.client') }}</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{{ t('invoices.amount') }}</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{{ t('common.status') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-zinc-800">
              <tr v-for="transaction in recentTransactions" :key="transaction.id" class="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(transaction.date) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {{ transaction.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {{ transaction.client }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-white">
                  ${{ Number(transaction.amount).toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    :class="{
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': transaction.status === 'paid',
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': transaction.status === 'pending',
                    }"
                    class="px-3 py-1 rounded-full text-xs font-semibold">
                    {{ t(`invoices.${transaction.status}`) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { log } from 'console'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()

const loading = ref(true)
const error = ref<string | null>(null)
const filters = ref({
  dateFrom: '',
  dateTo: '',
  period: 'month' as 'day' | 'week' | 'month' | 'year' | 'today' | 'custom'
})

const metrics = ref({
  totalRevenue: 0,
  revenueChange: 0,
  totalAppointments: 0,
  appointmentsChange: 0,
  newPets: 0,
  petsChange: 0,
  newClients: 0,
  clientsChange: 0
})

const popularServices = ref([
  { name: 'Vaccination', count: 45, revenue: 4500 },
  { name: 'General Checkup', count: 38, revenue: 3800 },
  { name: 'Surgery', count: 22, revenue: 8800 },
  { name: 'Dental Cleaning', count: 18, revenue: 2700 },
  { name: 'Grooming', count: 15, revenue: 1500 }
])

const recentTransactions = ref([
  { id: 1, date: new Date().toISOString(), description: 'Vaccination - Max', client: 'John Doe', amount: 150, status: 'paid' },
  { id: 2, date: new Date(Date.now() - 86400000).toISOString(), description: 'Surgery - Bella', client: 'Jane Smith', amount: 450, status: 'paid' },
  { id: 3, date: new Date(Date.now() - 172800000).toISOString(), description: 'Checkup - Charlie', client: 'Bob Johnson', amount: 100, status: 'pending' },
  { id: 4, date: new Date(Date.now() - 259200000).toISOString(), description: 'Grooming - Luna', client: 'Alice Brown', amount: 75, status: 'paid' },
  { id: 5, date: new Date(Date.now() - 345600000).toISOString(), description: 'Dental - Rocky', client: 'Tom Wilson', amount: 180, status: 'paid' }
])

const revenueChartData = ref<any>(null)
const appointmentsChartData = ref<any>(null)


const setPeriod = () => {
  const today = new Date()
  const period = filters.value.period

  switch (period) {
    case 'today':
      filters.value.dateFrom = today.toISOString().split('T')[0] || ''
      filters.value.dateTo = today.toISOString().split('T')[0] || ''
      break
    case 'week':
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
      filters.value.dateFrom = weekStart.toISOString().split('T')[0] || ''
      filters.value.dateTo = new Date().toISOString().split('T')[0] || ''
      break
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      filters.value.dateFrom = monthStart.toISOString().split('T')[0] || ''
      filters.value.dateTo = new Date().toISOString().split('T')[0] || ''
      break
    case 'year':
      const yearStart = new Date(today.getFullYear(), 0, 1)
      filters.value.dateFrom = yearStart.toISOString().split('T')[0] || ''
      filters.value.dateTo = new Date().toISOString().split('T')[0] || ''
      break
  }

  if (period !== 'custom') {
    fetchReports()
  }
}

const fetchReports = async () => {
  loading.value = true
  error.value = null

  try {
    const params: Record<string, any> = {}

    // Only add dates if they exist
    if (filters.value.dateFrom) {
      params.from_date = filters.value.dateFrom
    }
    if (filters.value.dateTo) {
      params.to_date = filters.value.dateTo
    }

    // Only add group_by if it's a valid period
    if (['day', 'week', 'month', 'year'].includes(filters.value.period)) {
      params.group_by = filters.value.period
    } else if (filters.value.period === 'today') {
      params.group_by = 'day'
    } else if (filters.value.period === 'custom') {
      // For custom periods, intelligently choose grouping based on date range
      if (filters.value.dateFrom && filters.value.dateTo) {
        const from = new Date(filters.value.dateFrom)
        const to = new Date(filters.value.dateTo)
        const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff <= 7) {
          params.group_by = 'day'
        } else if (daysDiff <= 60) {
          params.group_by = 'week'
        } else if (daysDiff <= 365) {
          params.group_by = 'month'
        } else {
          params.group_by = 'year'
        }
      } else {
        params.group_by = 'month'
      }
    }

    // Calculate previous period dates for comparison
    const previousParams: Record<string, any> = {}
    if (filters.value.dateFrom && filters.value.dateTo) {
      const fromDate = new Date(filters.value.dateFrom)
      const toDate = new Date(filters.value.dateTo)
      const periodLength = toDate.getTime() - fromDate.getTime()

      const previousFromDate = new Date(fromDate.getTime() - periodLength)
      const previousToDate = new Date(fromDate.getTime() - 1000 * 60 * 60 * 24) // Day before current period

      previousParams.from_date = previousFromDate.toISOString().split('T')[0]
      previousParams.to_date = previousToDate.toISOString().split('T')[0]
    }

    // Fetch all report data with error handling for each
    const [revenue, appointments, services, clientRetention, pets, previousRevenue, previousAppointments, previousPets] = await Promise.allSettled([
      $apiService.reports.getRevenue(params),
      $apiService.reports.getAppointments(params),
      $apiService.reports.getServices(params),
      $apiService.reports.getClientRetention(params),
      $apiService.reports.getPets(params),
      previousParams.from_date ? $apiService.reports.getRevenue(previousParams) : Promise.resolve({ total_revenue: 0 }),
      previousParams.from_date ? $apiService.reports.getAppointments(previousParams) : Promise.resolve({ total_appointments: 0 }),
      previousParams.from_date ? $apiService.reports.getPets(previousParams) : Promise.resolve({ total_pets: 0 })
    ])

    // Extract data with fallbacks
    const revenueData = revenue.status === 'fulfilled' ? revenue.value : { total_revenue: 0, pending_revenue: 0, total_invoices: 0, paid_invoices: 0, average_invoice_value: 0 }
    const appointmentsData = appointments.status === 'fulfilled' ? appointments.value : { total_appointments: 0, by_status: {}, by_type: {}, by_veterinarian: [], completion_rate: 0, no_show_rate: 0 }
    const servicesData = services.status === 'fulfilled' ? services.value : { popular_services: [] }
    const clientRetentionData = clientRetention.status === 'fulfilled' ? clientRetention.value : { total_clients: 0, active_clients: 0, returning_clients: 0, retention_rate: 0, return_rate: 0 }
    const petsData = pets.status === 'fulfilled' ? pets.value : { total_pets: 0, by_species: {} }
    const previousRevenueData = previousRevenue.status === 'fulfilled' ? previousRevenue.value : { total_revenue: 0 }
    const previousAppointmentsData = previousAppointments.status === 'fulfilled' ? previousAppointments.value : { total_appointments: 0 }
    const previousPetsData = previousPets.status === 'fulfilled' ? previousPets.value : { total_pets: 0 }

    // Calculate percentage changes
    const calculatePercentageChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    // Map revenue data to metrics
    metrics.value = {
      totalRevenue: revenueData.total_revenue || 0,
      revenueChange: calculatePercentageChange(
        revenueData.total_revenue || 0,
        previousRevenueData.total_revenue || 0
      ),
      totalAppointments: appointmentsData.total_appointments || 0,
      appointmentsChange: calculatePercentageChange(
        appointmentsData.total_appointments || 0,
        previousAppointmentsData.total_appointments || 0
      ),
      newPets: petsData.total_pets || 0,
      petsChange: calculatePercentageChange(
        petsData.total_pets || 0,
        previousPetsData.total_pets || 0
      ),
      newClients: clientRetentionData.active_clients || 0,
      clientsChange: clientRetentionData.retention_rate || 0
    }

    // Map popular services
    popularServices.value = servicesData.popular_services?.map(service => ({
      name: service.type || 'Unknown',
      count: service.count || 0,
      revenue: 0 // Revenue not included in services endpoint
    })) || []

    // Prepare revenue chart data
    if (revenueData.by_period && revenueData.by_period.length > 0) {
      // Format labels based on the grouping
      const formatLabel = (period: string, groupBy: string) => {
        if (groupBy === 'day') {
          // Format as "Nov 1", "Nov 2", etc.
          const date = new Date(period)
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        } else if (groupBy === 'week') {
          // Format week number
          return `Week ${period}`
        } else if (groupBy === 'month') {
          // Format as "Jan 2025", "Feb 2025", etc.
          const parts = period.split('-')
          if (parts.length === 2 && parts[0] && parts[1]) {
            const year = parts[0]
            const month = parts[1]
            const date = new Date(parseInt(year), parseInt(month) - 1)
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          }
          return period
        } else if (groupBy === 'year') {
          return period
        }
        return period
      }

      revenueChartData.value = {
        labels: revenueData.by_period.map((item: any) => formatLabel(item.period, params.group_by || 'day')),
        datasets: [{
          label: 'Revenue',
          data: revenueData.by_period.map((item: any) => item.revenue),
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      }
    } else {
      // If no period data, show simple bar with total
      revenueChartData.value = {
        labels: ['Total Revenue'],
        datasets: [{
          label: 'Revenue',
          data: [revenueData.total_revenue || 0],
          backgroundColor: 'rgba(99, 102, 241, 0.6)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2
        }]
      }
    }

    // Prepare appointments chart data (pie/doughnut chart by status)
    if (appointmentsData.by_status && Object.keys(appointmentsData.by_status).length > 0) {
      const statusColors: Record<string, string> = {
        scheduled: 'rgb(59, 130, 246)',
        confirmed: 'rgb(34, 197, 94)',
        completed: 'rgb(16, 185, 129)',
        cancelled: 'rgb(239, 68, 68)',
        no_show: 'rgb(249, 115, 22)',
        pending: 'rgb(250, 204, 21)'
      }

      appointmentsChartData.value = {
        labels: Object.keys(appointmentsData.by_status).map(status =>
          status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
        ),
        datasets: [{
          data: Object.values(appointmentsData.by_status),
          backgroundColor: Object.keys(appointmentsData.by_status).map(
            status => statusColors[status] || 'rgb(156, 163, 175)'
          ),
          borderWidth: 2,
          borderColor: '#fff'
        }]
      }
    } else {
      appointmentsChartData.value = null
    }

    // Fetch recent invoices for transactions
    try {
      const invoicesResponse = await $apiService.invoices.getAll({
        page: 1,
        per_page: 5,
        date_from: params.from_date,
        date_to: params.to_date
      })

      recentTransactions.value = (invoicesResponse.data || []).map((invoice: any) => ({
        id: invoice.id,
        date: invoice.invoice_date || invoice.issue_date || new Date().toISOString(),
        description: `Invoice #${invoice.invoice_number}`,
        client: invoice.owner?.name || 'N/A',
        amount: invoice.total_amount || invoice.total || 0,
        status: invoice.status || 'pending'
      }))
    } catch (invoiceErr) {
      console.error('Error fetching invoices:', invoiceErr)
      recentTransactions.value = []
    }

  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load reports'
    console.error('Error fetching reports:', err)
  } finally {
    loading.value = false
  }
}

const refreshReports = () => {
  fetchReports()
}

const exportReport = (format: 'pdf' | 'excel') => {
  // Implement export functionality
  console.log(`Exporting report as ${format}`)
  alert(t('reports.exportSuccess', { format: format.toUpperCase() }))
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  setPeriod()
})
</script>
