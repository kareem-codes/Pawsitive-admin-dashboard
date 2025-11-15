<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {{ t('nav.invoices') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('invoices.subtitle') }}</p>
      </div>
      <NuxtLink
        to="/invoices/create"
        class="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold">
        <Icon name="mdi:plus-circle" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        {{ t('invoices.createInvoice') }}
      </NuxtLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-zinc-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('invoices.totalRevenue') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ stats.total_revenue }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
            <Icon name="mdi:currency-usd" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-zinc-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('invoices.pending') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ stats.pending_amount }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
            <Icon name="mdi:clock-outline" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-zinc-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('invoices.paid') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.paid_count }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
            <Icon name="mdi:check-circle" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-zinc-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('invoices.overdue') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.overdue_count }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 flex items-center justify-center">
            <Icon name="mdi:alert-circle" class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>
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
              :placeholder="t('invoices.searchPlaceholder')"
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
            @change="() => fetchInvoices()">
            <option value="">{{ t('common.all') }}</option>
            <option value="draft">{{ t('invoices.draft') }}</option>
            <option value="pending">{{ t('invoices.pending') }}</option>
            <option value="paid">{{ t('invoices.paid') }}</option>
            <option value="overdue">{{ t('invoices.overdue') }}</option>
            <option value="cancelled">{{ t('invoices.cancelled') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('invoices.dateRange') }}
          </label>
          <input
            v-model="filters.date"
            type="date"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
            @change="() => fetchInvoices()" />
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
      <Icon name="mdi:loading" class="w-12 h-12 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">{{ t('common.loading') }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="invoices.length === 0" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-16 text-center border border-gray-100 dark:border-zinc-800">
      <Icon name="mdi:receipt-text-outline" class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('invoices.noInvoicesFound') }}</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('invoices.noInvoicesDesc') }}</p>
      <NuxtLink
        to="/invoices/create"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg">
        <Icon name="mdi:plus-circle" class="w-5 h-5" />
        {{ t('invoices.createInvoice') }}
      </NuxtLink>
    </div>

    <!-- Invoices Table -->
    <div v-else class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-zinc-800">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('invoices.invoiceNumber') }}
              </th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('invoices.client') }}
              </th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('invoices.issueDate') }}
              </th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('invoices.dueDate') }}
              </th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('invoices.amount') }}
              </th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.status') }}
              </th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-zinc-800">
            <tr
              v-for="invoice in invoices"
              :key="invoice.id"
              class="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
              @click="viewInvoice(invoice.id)">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-mono font-semibold text-indigo-600 dark:text-indigo-400">#{{ invoice.invoice_number }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 flex items-center justify-center">
                    <Icon name="mdi:account" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900 dark:text-white">{{ invoice.owner?.name || 'N/A' }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ invoice.owner?.email || '' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ (invoice.invoice_date || invoice.issue_date) ? formatDate(invoice.invoice_date || invoice.issue_date || '') : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ invoice.due_date ? formatDate(invoice.due_date) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="font-bold text-gray-900 dark:text-white">${{ invoice.total_amount || invoice.total || 0 }}</div>
                <div v-if="invoice.paid_amount && invoice.paid_amount > 0" class="text-xs text-gray-500 dark:text-gray-400">
                  {{ t('invoices.paidAmount') }}: ${{ invoice.paid_amount }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="{
                    'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400': invoice.status === 'draft',
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': invoice.status === 'pending',
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': invoice.status === 'paid',
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': invoice.status === 'overdue',
                    'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400': invoice.status === 'cancelled',
                  }"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize">
                  <Icon
                    :name="invoice.status === 'paid' ? 'mdi:check-circle' : invoice.status === 'overdue' ? 'mdi:alert-circle' : 'mdi:clock'"
                    class="w-3.5 h-3.5" />
                  {{ t(`invoices.${invoice.status}`) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-start gap-2">
                  <!-- <button
                    v-if="invoice.status === 'pending'"
                    @click.stop="recordPayment(invoice)"
                    class="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
                    :title="t('invoices.recordPayment')">
                    <Icon name="mdi:cash" class="w-4 h-4" />
                  </button> -->
                  <button
                    @click.stop="editInvoice(invoice.id)"
                    class="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
                    :title="t('common.edit')">
                    <Icon name="mdi:pencil" class="w-4 h-4" />
                  </button>
                  <button
                    @click.stop="downloadInvoice(invoice.id)"
                    class="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                    :title="t('invoices.downloadPdf')">
                    <Icon name="mdi:download" class="w-4 h-4" />
                  </button>
                  <button
                    @click.stop="confirmDelete(invoice)"
                    class="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                    :title="t('common.delete')">
                    <Icon name="mdi:delete" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

    <!-- Delete Confirmation Modal -->
    <div
      v-if="deleteModal.show"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="deleteModal.show = false">
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-zinc-800"
        @click.stop>
        <div class="flex items-start gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <Icon name="mdi:alert-circle" class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ t('invoices.deleteConfirm') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('invoices.deleteWarning') }} <strong>#{{ deleteModal.invoice?.invoice_number }}</strong>?
            </p>
            <p class="text-sm text-red-600 dark:text-red-400 mt-2">{{ t('invoices.deleteIrreversible') }}</p>
          </div>
        </div>
        <div class="flex gap-3 justify-end">
          <button
            @click="deleteModal.show = false"
            class="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 font-medium transition-all">
            {{ t('common.cancel') }}
          </button>
          <button
            @click="deleteInvoice"
            :disabled="deleteModal.deleting"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <Icon v-if="deleteModal.deleting" name="mdi:loading" class="w-4 h-4 animate-spin" />
            <Icon v-else name="mdi:delete" class="w-4 h-4" />
            {{ deleteModal.deleting ? t('common.deleting') : t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Invoice } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()
const router = useRouter()

const loading = ref(true)
const invoices = ref<Invoice[]>([])
const filters = ref({
  search: '',
  status: '',
  date: ''
})

const stats = ref({
  total_revenue: 0,
  pending_amount: 0,
  paid_count: 0,
  overdue_count: 0
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

const deleteModal = ref({
  show: false,
  invoice: null as Invoice | null,
  deleting: false
})

let searchTimeout: NodeJS.Timeout

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchInvoices()
  }, 500)
}

const fetchInvoices = async (page: number = 1) => {
  loading.value = true
  try {
    const response = await $apiService.invoices.getAll({
      page,
      per_page: pagination.value.per_page,
      search: filters.value.search || undefined,
      status: filters.value.status || undefined,
      date_from: filters.value.date || undefined
    })

    invoices.value = response.data
    pagination.value = {
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total
    }

    // Calculate stats
    
    const totalRevenue = response.data.reduce(
      (sum: number, inv: Invoice) => sum + (parseFloat(String(inv.total_amount || 0)) || 0),
      0
    )

    const pendingAmount = response.data
      .filter((inv: Invoice) => inv.status === 'pending')
      .reduce((sum: number, inv: Invoice) => sum + (parseFloat(String(inv.total_amount || inv.total || 0)) || 0), 0)

    stats.value.total_revenue = parseFloat(totalRevenue.toFixed(2))
    stats.value.pending_amount = parseFloat(pendingAmount.toFixed(2))
    stats.value.paid_count = response.data.filter((inv: Invoice) => inv.status === 'paid').length

    stats.value.overdue_count = response.data.filter((inv: Invoice) => inv.status === 'overdue').length
  } catch (error) {
    console.error('Error fetching invoices:', handleError(error))
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
  fetchInvoices()
}

const changePage = (page: number) => {
  fetchInvoices(page)
}

const viewInvoice = (id: number) => {
  router.push(`/invoices/${id}`)
}

const editInvoice = (id: number) => {
  router.push(`/invoices/create?id=${id}`)
}

const recordPayment = (invoice: Invoice) => {
  // Navigate to payment recording page or open modal
  router.push(`/invoices/${invoice.id}/payment`)
}

const confirmDelete = (invoice: Invoice) => {
  deleteModal.value.invoice = invoice
  deleteModal.value.show = true
}

const deleteInvoice = async () => {
  if (!deleteModal.value.invoice) return

  deleteModal.value.deleting = true
  try {
    await $apiService.invoices.delete(deleteModal.value.invoice.id)
    deleteModal.value.show = false
    deleteModal.value.invoice = null
    await fetchInvoices(pagination.value.current_page)
  } catch (error) {
    console.error('Error deleting invoice:', handleError(error))
  } finally {
    deleteModal.value.deleting = false
  }
}

const downloadInvoice = async (id: number) => {
  try {
    const response = await $apiService.invoices.downloadPdf(id)
    // Handle PDF download
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${id}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading invoice:', handleError(error))
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchInvoices()
})
</script>
