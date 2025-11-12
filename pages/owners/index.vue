<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {{ t('nav.owners') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('owners.subtitle') }}</p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      >
        <Icon name="mdi:plus-circle" class="w-5 h-5" />
        {{ t('owners.addOwner') }}
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 dark:border-zinc-800">
      <div class="relative max-w-md">
        <Icon name="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('owners.searchPlaceholder')"
          class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:text-white transition-all"
          @input="debouncedSearch"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <Icon name="mdi:loading" class="w-12 h-12 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
      <p class="text-gray-500 dark:text-gray-400 mt-4">{{ t('owners.loading') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
      <Icon name="mdi:alert-circle" class="w-12 h-12 mx-auto text-red-600 dark:text-red-400 mb-2" />
      <p class="text-red-600 dark:text-red-400 font-semibold">{{ error }}</p>
      <button @click="fetchOwners" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
        {{ t('owners.tryAgain') }}
      </button>
    </div>

    <!-- Owners Table -->
    <div v-else-if="owners.length > 0" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
            <tr>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{{ t('owners.name') }}</th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{{ t('owners.contact') }}</th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{{ t('owners.location') }}</th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{{ t('owners.pets') }}</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{{ t('owners.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-zinc-700">
            <tr
              v-for="owner in owners"
              :key="owner.id"
              class="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon name="mdi:account" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div class="min-w-0">
                    <div class="font-semibold text-gray-900 dark:text-white truncate">{{ owner.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  <div class="flex items-center gap-1 mb-1">
                    <Icon name="mdi:email" class="w-4 h-4" />
                    <span class="truncate">{{ owner.email }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Icon name="mdi:phone" class="w-4 h-4" />
                    <span>{{ owner.phone }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  <div>{{ owner.city }}</div>
                  <div v-if="owner.postal_code" class="text-xs">{{ owner.postal_code }}</div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-semibold">
                  {{ owner.pets?.length || 0 }} {{ t('owners.pets').toLowerCase() }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-start gap-2">
                  <NuxtLink
                    :to="`/owners/${owner.id}`"
                    class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all text-sm font-medium"
                  >
                    {{ t('owners.view') }}
                  </NuxtLink>
                  <button
                    @click="deleteOwner(owner.id)"
                    class="px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-all"
                  >
                    <Icon name="mdi:delete" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-12 text-center border border-gray-100 dark:border-zinc-800">
      <Icon name="mdi:account-off" class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ t('owners.noOwnersFound') }}</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('owners.noOwnersDesc') }}</p>
      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Icon name="mdi:plus-circle" class="w-5 h-5" />
        {{ t('owners.addFirstOwner') }}
      </button>
    </div>

    <!-- Owner Form Modal -->
    <OwnerFormModal
      v-model="showOwnerModal"
      :owner-id="selectedOwnerId"
      @saved="handleOwnerSaved"
    />

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-2">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 border-2 border-gray-200 dark:border-zinc-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
      >
        <Icon name="mdi:chevron-left" class="w-5 h-5" />
      </button>
      
      <span class="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium">
        {{ t('owners.page') }} {{ currentPage }} {{ t('owners.of') }} {{ totalPages }}
      </span>
      
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border-2 border-gray-200 dark:border-zinc-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
      >
        <Icon name="mdi:chevron-right" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Owner } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { $apiService } = useNuxtApp()

const loading = ref(true)
const error = ref<string | null>(null)
const owners = ref<Owner[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const limit = 20

// Modal state
const showOwnerModal = ref(false)
const selectedOwnerId = ref<number | null>(null)

const fetchOwners = async () => {
  try {
    loading.value = true
    error.value = null

    const result = await $apiService.owners.getAll({
      page: currentPage.value,
      per_page: limit,
      search: searchQuery.value
    }).catch(() => {
      // Mock data fallback
      return {
        data: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 234-567-8900',
            address: '123 Main St',
            city: 'New York',
            postal_code: '10001',
            pets: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1 234-567-8901',
            address: '456 Oak Ave',
            city: 'Los Angeles',
            postal_code: '90001',
            pets: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            phone: '+1 234-567-8902',
            address: '789 Pine Rd',
            city: 'Chicago',
            postal_code: '60601',
            pets: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        total: 3,
        page: 1,
        limit: 20
      }
    })

    owners.value = result.data
    totalItems.value = result.total
    totalPages.value = Math.ceil(result.total / limit)
  } catch (err: any) {
    console.error('Error fetching owners:', err)
    error.value = err.message || 'Failed to load owners'
  } finally {
    loading.value = false
  }
}

const deleteOwner = async (id: number) => {
  if (!confirm(t('owners.deleteConfirm'))) return

  try {
    await $apiService.owners.delete(id)
    await fetchOwners()
  } catch (err: any) {
    console.error('Error deleting owner:', err)
    alert(t('owners.deleteFailed'))
  }
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchOwners()
}

let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchOwners()
  }, 500)
}

const openCreateModal = () => {
  selectedOwnerId.value = null
  showOwnerModal.value = true
}

const handleOwnerSaved = () => {
  fetchOwners()
}

onMounted(() => {
  fetchOwners()
})
</script>
