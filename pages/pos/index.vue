<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {{ t('pos.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('pos.subtitle') }}</p>
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

    <!-- Success Alert -->
    <div v-if="successMessage" class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
      <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
      <div class="flex-1">
        <h3 class="text-sm font-semibold text-green-800 dark:text-green-300">{{ t('common.success') }}</h3>
        <p class="text-sm text-green-700 dark:text-green-400 mt-1">{{ successMessage }}</p>
      </div>
      <button @click="successMessage = null" class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
        <Icon name="mdi:close" class="w-5 h-5" />
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Products Section -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 p-6">
          <!-- Search -->
          <div class="mb-6">
            <div class="relative">
              <Icon name="mdi:magnify" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('pos.searchProducts')"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
              />
            </div>
          </div>

          <!-- Products Grid -->
          <div v-if="loading" class="text-center py-12">
            <Icon name="mdi:loading" class="w-12 h-12 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">{{ t('pos.loadingProducts') }}</p>
          </div>

          <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
            <Icon name="mdi:package-variant" class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p class="text-gray-500 dark:text-gray-400">{{ t('pos.noProducts') }}</p>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
            <button
              v-for="product in filteredProducts"
              :key="product.id"
              @click="addToCart(product)"
              :disabled="product.quantity_in_stock <= 0"
              class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-4 border-2 border-gray-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div class="flex flex-col items-center text-center">
                <!-- Product Image -->
                <div class="w-full h-30 rounded-lg flex items-center justify-center mb-3 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-800">
                  <img 
                    v-if="product.image_url" 
                    :src="product.image_url" 
                    :alt="product.name"
                    class="w-full h-full object-cover"
                  />
                  <Icon v-else name="mdi:package-variant" class="w-full h-40 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 class="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">{{ product.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ product.sku }}</p>
                <p class="text-lg font-bold text-indigo-600 dark:text-indigo-400">${{ product.price }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('pos.stock') }}: {{ product.quantity_in_stock }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Cart Section -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 p-6 sticky top-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="mdi:cart" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {{ t('pos.shoppingCart') }}
          </h2>

          <!-- Cart Items -->
          <div v-if="cart.length === 0" class="text-center py-12">
            <Icon name="mdi:cart-outline" class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p class="text-gray-500 dark:text-gray-400">{{ t('pos.cartEmpty') }}</p>
          </div>

          <div v-else class="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
            <div
              v-for="item in cart"
              :key="item.id"
              class="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-700"
            >
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-semibold text-gray-900 dark:text-white text-sm flex-1">{{ item.name }}</h4>
                <button
                  @click="removeFromCart(item.id)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 ml-2"
                >
                  <Icon name="mdi:close" class="w-5 h-5" />
                </button>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <button
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                    class="w-7 h-7 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-zinc-600 disabled:opacity-50"
                  >
                    <Icon name="mdi:minus" class="w-4 h-4" />
                  </button>
                  <span class="w-8 text-center font-semibold text-gray-900 dark:text-white">{{ item.quantity }}</span>
                  <button
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    :disabled="item.quantity >= item.stock"
                    class="w-7 h-7 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-zinc-600 disabled:opacity-50"
                  >
                    <Icon name="mdi:plus" class="w-4 h-4" />
                  </button>
                </div>
                <p class="font-bold text-indigo-600 dark:text-indigo-400">${{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <!-- Totals -->
          <div v-if="cart.length > 0" class="border-t border-gray-200 dark:border-zinc-700 pt-4 space-y-3">
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{{ t('pos.subtotal') }}</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{{ t('pos.tax') }} ({{ taxRate }}%)</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-zinc-700 pt-3">
              <span>{{ t('pos.total') }}</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>

            <!-- Customer Selection -->
            <div class="pt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('pos.customer') }} <span class="text-gray-400 text-xs">({{ t('common.optional') }})</span>
              </label>
              <select
                v-model="selectedCustomerId"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
              >
                <option :value="null">{{ t('pos.selectCustomer') }}</option>
                <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                  {{ owner.name }}
                </option>
              </select>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('pos.customerOptional') }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2 pt-4">
              <button
                @click="processPayment"
                :disabled="processing"
                class="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Icon v-if="!processing" name="mdi:cash-check" class="w-5 h-5" />
                <Icon v-else name="mdi:loading" class="w-5 h-5 animate-spin" />
                {{ processing ? t('pos.processing') : t('pos.completeSale') }}
              </button>
              <button
                @click="clearCart"
                class="w-full px-6 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-900 dark:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Icon name="mdi:cart-remove" class="w-5 h-5" />
                {{ t('pos.clearCart') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { $apiService } = useNuxtApp()

const loading = ref(true)
const processing = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const searchQuery = ref('')
const selectedCustomerId = ref<number | null>(null)

const products = ref<any[]>([])
const owners = ref<any[]>([])
const cart = ref<any[]>([])

const taxRate = ref(10) // 10% tax

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.sku.toLowerCase().includes(query)
  )
})

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const tax = computed(() => {
  return subtotal.value * (taxRate.value / 100)
})

const total = computed(() => {
  return subtotal.value + tax.value
})

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await $apiService.products.getAll({ per_page: 100 })
    // Filter only products with stock, or show all but disable out-of-stock ones
    products.value = response.data || []
    console.log('Loaded products:', products.value.length)
  } catch (err: any) {
    error.value = err.response?.data?.message || t('pos.failedToLoadProducts')
    console.error('Error loading products:', err)
  } finally {
    loading.value = false
  }
}

const fetchOwners = async () => {
  try {
    const response = await $apiService.owners.getAll({ per_page: 100 })
    owners.value = response.data || []
  } catch (err) {
    console.error('Failed to load owners:', err)
  }
}

const addToCart = (product: any) => {
  const existingItem = cart.value.find(item => item.id === product.id)
  
  if (existingItem) {
    if (existingItem.quantity < product.quantity_in_stock) {
      existingItem.quantity++
    }
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: 1,
      stock: product.quantity_in_stock
    })
  }
}

const removeFromCart = (productId: number) => {
  cart.value = cart.value.filter(item => item.id !== productId)
}

const updateQuantity = (productId: number, newQuantity: number) => {
  const item = cart.value.find(item => item.id === productId)
  if (item && newQuantity >= 1 && newQuantity <= item.stock) {
    item.quantity = newQuantity
  }
}

const clearCart = () => {
  cart.value = []
  selectedCustomerId.value = null
  error.value = null
  successMessage.value = null
}

const processPayment = async () => {
  if (cart.value.length === 0) return

  processing.value = true
  error.value = null
  successMessage.value = null

  try {
    const authStore = useAuthStore()

    // Create invoice
    const invoiceData: any = {
      user_id: selectedCustomerId.value, // Optional now
      created_by: authStore.user?.id,
      invoice_number: `INV-${Date.now()}`,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date().toISOString().split('T')[0],
      items: cart.value.map(item => ({
        product_id: item.id,
        type: 'product',
        item_name: item.name,
        description: item.sku,
        quantity: item.quantity,
        unit_price: item.price,
        tax_percentage: taxRate.value, // Include tax percentage
        subtotal: item.price * item.quantity
      })),
      subtotal: subtotal.value,
      tax: tax.value,
      total_amount: total.value,
      status: 'paid',
      notes: t('pos.posSale')
    }

    const invoiceResponse = await $apiService.invoices.create(invoiceData)
    const invoice = invoiceResponse.invoice
    
    // Create payment
    await $apiService.payments.create({
      invoice_id: invoice.id,
      payment_number: `PAY-${Date.now()}`,
      amount: total.value,
      payment_method: 'cash',
      payment_date: new Date().toISOString().split('T')[0],
      received_by: authStore.user?.id,
      status: 'completed'
    })

    successMessage.value = `${t('pos.saleCompleted')} ${t('pos.invoice')} #${invoice.invoice_number}`
    clearCart()
    await fetchProducts() // Refresh products to update stock
  } catch (err: any) {
    error.value = err.response?.data?.message || t('pos.failedToProcess')
    console.error('Payment processing error:', err)
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  fetchProducts()
  fetchOwners()
})
</script>
