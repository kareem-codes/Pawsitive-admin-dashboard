<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {{ t('nav.products') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('products.subtitle') }}</p>
      </div>
      <NuxtLink
        to="/products/create"
        class="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
      >
        <Icon name="mdi:plus-circle" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        {{ t('products.new') }}
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
              :placeholder="t('products.searchPlaceholder')"
              class="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
              @input="debouncedSearch"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('products.category') }}
          </label>
          <select
            v-model="filters.category"
            
            style="appearance: listbox;"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
            @change="() => fetchProducts()"
          >
            <option value="">{{ t('common.all') }}</option>
            <option value="medication">{{ t('products.medication') }}</option>
            <option value="food">{{ t('products.food') }}</option>
            <option value="accessory">{{ t('products.accessory') }}</option>
            <option value="service">{{ t('products.service') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('products.stockStatus') }}
          </label>
          <select
            v-model="filters.stock_status"
            
            style="appearance: listbox;"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
            @change="() => fetchProducts()"
          >
            <option value="">{{ t('common.all') }}</option>
            <option value="in_stock">{{ t('products.inStock') }}</option>
            <option value="low_stock">{{ t('products.lowStock') }}</option>
            <option value="out_of_stock">{{ t('products.outOfStock') }}</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 font-medium transition-all flex items-center justify-start gap-2"
          >
            <Icon name="mdi:filter-off" class="w-5 h-5" />
            {{ t('common.clearFilters') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <Icon name="mdi:loading" class="w-12 h-12 animate-spin mx-auto text-emerald-600 dark:text-emerald-400" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">{{ t('common.loading') }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-16 text-center border border-gray-100 dark:border-zinc-800">
      <Icon name="mdi:package-variant-closed" class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('products.noProductsFound') }}</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('products.noProductsDesc') }}</p>
      <NuxtLink
        to="/products/create"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
      >
        <Icon name="mdi:plus-circle" class="w-5 h-5" />
        {{ t('products.new') }}
      </NuxtLink>
    </div>

    <!-- Products Table -->
    <div v-else class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-zinc-800">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.name') }}
              </th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('products.category') }}
              </th>
              <th class="px-6 py-4 ltr:text-left rtl:text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('products.sku') }}
              </th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('products.price') }}
              </th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('products.stock') }}
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
              v-for="product in products"
              :key="product.id"
              class="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
              @click="viewProduct(product.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                    <Icon :name="getCategoryIcon(product.category)" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900 dark:text-white">{{ product.name }}</div>
                    <div v-if="product.description" class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {{ product.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 capitalize">
                  <Icon :name="getCategoryIcon(product.category)" class="w-3.5 h-3.5" />
                  {{ product.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-mono text-sm text-gray-600 dark:text-gray-400">{{ product.sku }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="font-bold text-gray-900 dark:text-white">${{ product.price }}</div>
                <div v-if="product.cost_price" class="text-xs text-gray-500 dark:text-gray-400">
                  {{ t('products.cost') }}: ${{ product.cost_price }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex flex-col items-center">
                  <span class="font-bold text-lg text-gray-900 dark:text-white">{{ product.stock_quantity }}</span>
                  <span v-if="product.min_stock_level" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ t('products.min') }}: {{ product.min_stock_level }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="{
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300': getStockStatus(product) === 'in_stock',
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300': getStockStatus(product) === 'low_stock',
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': getStockStatus(product) === 'out_of_stock',
                  }"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                >
                  <Icon
                    :name="getStockStatus(product) === 'in_stock' ? 'mdi:check-circle' : getStockStatus(product) === 'low_stock' ? 'mdi:alert' : 'mdi:close-circle'"
                    class="w-3.5 h-3.5"
                  />
                  {{ getStockStatus(product) === 'in_stock' ? t('products.inStock') : getStockStatus(product) === 'low_stock' ? t('products.lowStock') : t('products.outOfStock') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-start gap-2">
                  <button
                    @click.stop="editProduct(product.id)"
                    class="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
                    :title="t('common.edit')"
                  >
                    <Icon name="mdi:pencil" class="w-4 h-4" />
                  </button>
                  <button
                    @click.stop="deleteProduct(product.id)"
                    class="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                    :title="t('common.delete')"
                  >
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
          class="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {{ t('common.previous') }}
        </button>
        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {{ t('common.next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()
const router = useRouter()

const loading = ref(true)
const products = ref<Product[]>([])
const filters = ref({
  search: '',
  category: '',
  stock_status: ''
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

let searchTimeout: NodeJS.Timeout

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchProducts()
  }, 500)
}

const fetchProducts = async (page: number = 1) => {
  loading.value = true
  try {
    const response = await $apiService.products.getAll({
      page,
      per_page: pagination.value.per_page,
      search: filters.value.search || undefined,
      category: filters.value.category || undefined,
      low_stock: filters.value.stock_status === 'low_stock' ? true : undefined
    })

    products.value = response.data
    pagination.value = {
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total
    }
  } catch (error) {
    console.error('Error fetching products:', handleError(error))
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    stock_status: ''
  }
  fetchProducts()
}

const changePage = (page: number) => {
  fetchProducts(page)
}

const viewProduct = (id: number) => {
  router.push(`/products/${id}`)
}

const editProduct = (id: number) => {
  router.push(`/products/create?id=${id}`)
}

const deleteProduct = async (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await $apiService.products.delete(id)
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', handleError(error))
    }
  }
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    medication: 'mdi:pill',
    food: 'mdi:food',
    accessory: 'mdi:tag',
    service: 'mdi:hand-heart',
  }
  return icons[category.toLowerCase()] || 'mdi:package-variant'
}

const getStockStatus = (product: Product) => {
  if (product.stock_quantity === 0) return 'out_of_stock'
  if (product.min_stock_level && product.stock_quantity <= product.min_stock_level) return 'low_stock'
  return 'in_stock'
}

onMounted(() => {
  fetchProducts()
})
</script>
