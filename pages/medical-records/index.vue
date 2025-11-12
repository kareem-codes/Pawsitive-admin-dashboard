<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {{ t('nav.medicalRecords') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('medicalRecords.subtitle') }}</p>
      </div>
      <NuxtLink
        v-if="hasPermission('create medical records')"
        to="/medical-records/create"
        class="group flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold">
        <Icon name="mdi:plus-circle" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        {{ t('medicalRecords.addRecord') }}
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
              :placeholder="t('medicalRecords.searchPlaceholder')"
              class="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
              @input="debouncedSearch" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('common.recordType') }}
          </label>
          <select
            v-model="filters.type"
            style="appearance: listbox;"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
            @change="() => fetchRecords()">
            <option value="">{{ t('common.all') }}</option>
            <option value="examination">{{ t('common.examination') }}</option>
            <option value="surgery">{{ t('common.surgery') }}</option>
            <option value="vaccination">{{ t('common.vaccination') }}</option>
            <option value="prescription">{{ t('common.prescription') }}</option>
            <option value="lab_result">{{ t('common.labResult') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('common.date') }}
          </label>
          <input
            v-model="filters.date"
            type="date"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
            @change="() => fetchRecords()" />
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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <Icon name="mdi:loading" class="w-12 h-12 animate-spin mx-auto text-rose-600 dark:text-rose-400" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">{{ t('common.loading') }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="records.length === 0" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-16 text-center border border-gray-100 dark:border-zinc-800">
      <Icon name="mdi:file-document-outline" class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('medicalRecords.noRecordsFound') }}</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('medicalRecords.noRecordsDesc') }}</p>
      <NuxtLink
        to="/medical-records/create"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg">
        <Icon name="mdi:plus-circle" class="w-5 h-5" />
        {{ t('medicalRecords.addRecord') }}
      </NuxtLink>
    </div>

    <!-- Records List -->
    <div v-else class="space-y-4">
      <div
        v-for="record in records"
        :key="record.id"
        class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden transition-all duration-300 cursor-pointer"
        @click="viewRecord(record.id)">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center">
                <Icon name="mdi:file-document" class="w-7 h-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ record.pet?.name || t('medicalRecords.unknownPet') }}</h3>
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 capitalize">
                    {{ t('nav.medicalRecords') }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  <span class="font-medium">{{ t('appointments.owner') }}:</span> {{ record.pet?.owner?.name || 'N/A' }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  <span class="font-medium">Vet:</span> {{ record.veterinarian?.name || 'N/A' }}
                </p>
              </div>
            </div>
            <div class="flex flex-col items-start sm:items-end gap-1">
              <div class="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                <Icon name="mdi:calendar" class="w-4 h-4" />
                {{ formatDate(record.visit_date) }}
              </div>
              <div v-if="record.follow_up_date" class="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400">
                <Icon name="mdi:calendar-check" class="w-4 h-4" />
                Follow-up: {{ formatDate(record.follow_up_date) }}
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div v-if="record.diagnosis">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Diagnosis</p>
              <p class="text-sm text-gray-900 dark:text-white">{{ record.diagnosis }}</p>
            </div>
            <div v-if="record.treatment">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Treatment</p>
              <p class="text-sm text-gray-900 dark:text-white">{{ record.treatment }}</p>
            </div>
            <div v-if="record.notes">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Notes</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{{ record.notes }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <div class="flex flex-wrap gap-2">
              <span v-if="record.symptoms" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <Icon name="mdi:alert-circle-outline" class="w-3.5 h-3.5" />
                Symptoms Recorded
              </span>
              <span v-if="record.prescriptions" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <Icon name="mdi:pill" class="w-3.5 h-3.5" />
                Prescription
              </span>
            </div>
            <div class="flex gap-2">
              <button
                v-if="hasPermission('edit medical records')"
                @click.stop="editRecord(record.id)"
                class="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all"
                title="Edit">
                <Icon name="mdi:pencil" class="w-4 h-4" />
              </button>
              <button
                v-if="hasPermission('delete medical records')"
                @click.stop="deleteRecord(record.id)"
                class="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                title="Delete">
                <Icon name="mdi:delete" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > 0" class="mt-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl px-6 py-4 border border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
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
</template>

<script setup lang="ts">
import type { MedicalRecord } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()
const { hasPermission } = usePermissions()
const router = useRouter()

const loading = ref(true)
const records = ref<MedicalRecord[]>([])
const filters = ref({
  search: '',
  type: '',
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
    fetchRecords()
  }, 500)
}

const fetchRecords = async (page: number = 1) => {
  loading.value = true
  try {
    const response = await $apiService.medicalRecords.getAll({
      page,
      per_page: pagination.value.per_page,
      search: filters.value.search || undefined
    })

    records.value = response.data
    pagination.value = {
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total
    }
  } catch (error) {
    console.error('Error fetching medical records:', handleError(error))
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    type: '',
    date: ''
  }
  fetchRecords()
}

const changePage = (page: number) => {
  fetchRecords(page)
}

const viewRecord = (id: number) => {
  router.push(`/medical-records/${id}`)
}

const editRecord = (id: number) => {
  router.push(`/medical-records/create?id=${id}`)
}

const deleteRecord = async (id: number) => {
  if (confirm(t('medicalRecords.deleteConfirm'))) {
    try {
      await $apiService.medicalRecords.delete(id)
      fetchRecords()
    } catch (error) {
      console.error('Error deleting record:', handleError(error))
    }
  }
}

const getRecordIcon = (type?: string) => {
  const icons: Record<string, string> = {
    examination: 'mdi:stethoscope',
    surgery: 'mdi:medical-bag',
    vaccination: 'mdi:needle',
    prescription: 'mdi:pill',
    lab_result: 'mdi:flask',
  }
  return icons[type || ''] || 'mdi:file-document'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchRecords()
})
</script>
