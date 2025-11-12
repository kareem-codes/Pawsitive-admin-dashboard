<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {{ t('nav.appointments') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('appointments.subtitle') }}</p>
      </div>
      <NuxtLink
        to="/appointments/create"
        class="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold">
        <Icon name="mdi:plus-circle" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        {{ t('appointments.newAppointment') }}
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 dark:border-zinc-800">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('common.search') }}
          </label>
          <div class="relative">
            <Icon name="mdi:magnify" class="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="filters.search"
              type="text"
              :placeholder="t('appointments.searchPlaceholder')"
              class="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
              @input="debouncedSearch" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('common.status') }}
          </label>
          <select
            v-model="filters.status"
            style="appearance: listbox;"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
            @change="() => fetchAppointments()">
            <option value="">{{ t('common.all') }}</option>
            <option value="scheduled">{{ t('appointments.scheduled') }}</option>
            <option value="confirmed">{{ t('appointments.confirmed') }}</option>
            <option value="in-progress">{{ t('appointments.inProgress') }}</option>
            <option value="completed">{{ t('appointments.completed') }}</option>
            <option value="cancelled">{{ t('appointments.cancelled') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('common.date') }}
          </label>
          <input
            v-model="filters.date"
            type="date"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
            @change="() => fetchAppointments()" />
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 font-medium transition-all flex items-center justify-start gap-2">
            <Icon name="mdi:filter-off" class="w-5 h-5" />
            {{ t('common.clearFilters') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Appointments List -->
    <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <Icon name="mdi:loading" class="w-12 h-12 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">{{ t('common.loading') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="appointments.length === 0" class="text-center py-16">
        <Icon name="mdi:calendar-blank" class="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ t('appointments.noAppointments') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('appointments.noAppointmentsDesc') }}</p>
        <NuxtLink
          to="/appointments/create"
          class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
          <Icon name="mdi:plus-circle" class="w-5 h-5" />
          {{ t('appointments.newAppointment') }}
        </NuxtLink>
      </div>

      <!-- Appointments Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-zinc-800/50">
            <tr>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('appointments.pet') }}
              </th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('appointments.owner') }}
              </th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('appointments.dateTime') }}
              </th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('appointments.type') }}
              </th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.status') }}
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-zinc-800">
            <tr
              v-for="appointment in appointments"
              :key="appointment.id"
              class="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                    <Icon name="mdi:paw" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ appointment.pet?.name || 'N/A' }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ appointment.pet?.species }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900 dark:text-white">{{ appointment.owner?.name || 'N/A' }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ appointment.owner?.phone }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <Icon name="mdi:calendar" class="w-4 h-4 text-gray-400" />
                  <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(appointment.appointment_date) }}</span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <Icon name="mdi:clock-outline" class="w-4 h-4 text-gray-400" />
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(appointment.appointment_date) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900 dark:text-white capitalize">{{ appointment.reason || 'Checkup' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800': appointment.status === 'scheduled',
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800': appointment.status === 'confirmed',
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 ring-1 ring-purple-200 dark:ring-purple-800': appointment.status === 'in-progress',
                    'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 ring-1 ring-gray-200 dark:ring-gray-800': appointment.status === 'completed',
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800': appointment.status === 'cancelled',
                  }"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize">
                  <Icon
                    :name="appointment.status === 'completed' ? 'mdi:check-circle' : appointment.status === 'cancelled' ? 'mdi:close-circle' : 'mdi:clock'"
                    class="w-3.5 h-3.5" />
                  {{ appointment.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-start gap-2">
                  <button
                    @click="viewAppointment(appointment.id)"
                    class="p-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    :title="t('common.view')">
                    <Icon name="mdi:eye" class="w-5 h-5" />
                  </button>
                  <button
                    @click="editAppointment(appointment.id)"
                    class="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-all"
                    :title="t('common.edit')">
                    <Icon name="mdi:pencil" class="w-5 h-5" />
                  </button>
                  <button
                    @click="deleteAppointment(appointment.id)"
                    class="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    :title="t('common.delete')">
                    <Icon name="mdi:delete" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > 0" class="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          {{ t('common.showing') }} {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }} {{ t('common.to') }}
          {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} {{ t('common.of') }}
          {{ pagination.total }} {{ t('common.results') }}
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {{ t('common.previous') }}
          </button>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {{ t('common.next') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Appointment } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()
const router = useRouter()

const loading = ref(true)
const appointments = ref<Appointment[]>([])
const filters = ref({
  search: '',
  status: '',
  date: ''
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

let searchTimeout: NodeJS.Timeout

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchAppointments()
  }, 500)
}

const fetchAppointments = async (page: number = 1) => {
  loading.value = true
  try {
    const response = await $apiService.appointments.getAll({
      page,
      per_page: pagination.value.per_page,
      search: filters.value.search || undefined,
      status: filters.value.status || undefined,
      date: filters.value.date || undefined
    })

    appointments.value = response.data
    pagination.value = {
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total
    }
  } catch (error) {
    console.error('Error fetching appointments:', handleError(error))
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    date: ''
  }
  fetchAppointments()
}

const changePage = (page: number) => {
  fetchAppointments(page)
}

const viewAppointment = (id: number) => {
  router.push(`/appointments/${id}`)
}

const editAppointment = (id: number) => {
  router.push(`/appointments/create?id=${id}`)
}

const deleteAppointment = async (id: number) => {
  if (!confirm(t('appointments.confirmDelete'))) {
    return
  }

  try {
    await $apiService.appointments.delete(id)
    await fetchAppointments()
  } catch (error) {
    console.error('Error deleting appointment:', handleError(error))
    alert(t('appointments.errorDeleting'))
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchAppointments()
})
</script>
