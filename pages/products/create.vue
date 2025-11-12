<template>
  <div class="animate-fade-in max-w-4xl mx-auto">
    <!-- Breadcrumb -->
    <nav class="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink to="/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        <Icon name="mdi:home" class="w-4 h-4" />
      </NuxtLink>
      <Icon name="mdi:chevron-right" class="w-4 h-4" />
      <NuxtLink to="/products" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        {{ t('nav.products') }}
      </NuxtLink>
      <Icon name="mdi:chevron-right" class="w-4 h-4" />
      <span class="text-gray-900 dark:text-white font-medium">
        {{ isEdit ? t('products.editProduct') : t('products.createProduct') }}
      </span>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {{ isEdit ? t('products.editProduct') : t('products.createProduct') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ isEdit ? t('products.editSubtitle') : t('products.createSubtitle') }}
      </p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
      <div class="flex gap-3">
        <Icon name="mdi:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-red-800 dark:text-red-300">{{ t('common.error') }}</h3>
          <p class="text-sm text-red-700 dark:text-red-400 mt-1">{{ error }}</p>
        </div>
        <button @click="error = null" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
          <Icon name="mdi:close" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information Card -->
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Icon name="mdi:package-variant" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          {{ t('products.basicInfo') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Product Image -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              {{ t('products.productImage') }}
            </label>
            <div class="flex items-center gap-6">
              <div class="h-32 w-32 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-zinc-700">
                <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="h-full w-full object-cover" />
                <Icon v-else name="mdi:package-variant" class="w-16 h-16 text-indigo-300 dark:text-indigo-700" />
              </div>
              <div>
                <label class="cursor-pointer inline-flex items-center px-4 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-600 transition-colors">
                  <Icon name="mdi:upload" class="w-4 h-4 me-2" />
                  {{ t('common.uploadImage') }}
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleImageChange"
                    :disabled="loading"
                    class="hidden"
                  />
                </label>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  JPG, PNG or GIF (MAX. 5MB)
                </p>
              </div>
            </div>
          </div>

          <!-- Product Name -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.productName') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              :disabled="loading"
              :placeholder="t('products.productNamePlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- SKU -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.sku') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.sku"
              type="text"
              required
              :disabled="loading"
              :placeholder="t('products.skuPlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Barcode -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.barcode') }}
            </label>
            <input
              v-model="form.barcode"
              type="text"
              :disabled="loading"
              :placeholder="t('products.barcodePlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.category') }} <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category"
              required
              :disabled="loading"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
              <option value="">{{ t('products.selectCategory') }}</option>
              <option value="food">{{ t('products.food') }}</option>
              <option value="medicine">{{ t('products.medicine') }}</option>
              <option value="accessories">{{ t('products.accessories') }}</option>
              <option value="toys">{{ t('products.toys') }}</option>
              <option value="grooming">{{ t('products.grooming') }}</option>
              <option value="other">{{ t('products.other') }}</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.status') }}
            </label>
            <select
              v-model="form.is_active"
              :disabled="loading"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
              <option :value="true">{{ t('products.active') }}</option>
              <option :value="false">{{ t('products.inactive') }}</option>
            </select>
          </div>

          <!-- Description -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.description') }}
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              :disabled="loading"
              :placeholder="t('products.descriptionPlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all resize-none"></textarea>
          </div>
        </div>
      </div>

      <!-- Pricing & Stock Card -->
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Icon name="mdi:cash-multiple" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          {{ t('products.pricingStock') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.price') }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                step="0.01"
                required
                :disabled="loading"
                placeholder="0.00"
                class="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
            </div>
          </div>

          <!-- Cost Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.costPrice') }}
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
              <input
                v-model.number="form.cost"
                type="number"
                min="0"
                step="0.01"
                :disabled="loading"
                placeholder="0.00"
                class="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
            </div>
          </div>

          <!-- Quantity in Stock -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.quantityInStock') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.quantity_in_stock"
              type="number"
              min="0"
              step="1"
              required
              :disabled="loading"
              placeholder="0"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Reorder Threshold -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.reorderThreshold') }}
            </label>
            <input
              v-model.number="form.reorder_threshold"
              type="number"
              min="0"
              step="1"
              :disabled="loading"
              placeholder="10"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ t('products.reorderThresholdHint') }}</p>
          </div>

          <!-- Tax Percentage -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.taxPercentage') }}
            </label>
            <div class="relative">
              <input
                v-model.number="form.tax_percentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                :disabled="loading"
                placeholder="0"
                class="w-full px-4 pr-8 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
            </div>
          </div>

          <!-- Tax Fixed -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.taxFixed') }}
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
              <input
                v-model.number="form.tax_fixed"
                type="number"
                min="0"
                step="0.01"
                :disabled="loading"
                placeholder="0.00"
                class="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
            </div>
          </div>

          <!-- Expiry Date -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.expiryDate') }}
            </label>
            <input
              v-model="form.expiry_date"
              type="date"
              :min="tomorrow"
              :disabled="loading"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ t('products.expiryDateHint') }}</p>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          type="submit"
          :disabled="saving || loading"
          class="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Icon v-if="saving" name="mdi:loading" class="w-5 h-5 animate-spin" />
          <Icon v-else name="mdi:content-save" class="w-5 h-5" />
          {{ saving ? t('common.saving') : (isEdit ? t('common.update') : t('common.create')) }}
        </button>
        <button
          type="button"
          @click="router.push('/products')"
          :disabled="saving"
          class="flex-1 sm:flex-none px-6 py-3 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Icon name="mdi:close" class="w-5 h-5" />
          {{ t('common.cancel') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { $apiService } = useNuxtApp()

const productId = computed(() => {
  // Support both /products/create?id=1 and /products/1/create patterns
  if (route.query.id) return Number(route.query.id)
  if (route.params.id) return Number(route.params.id)
  return null
})
const isEdit = computed(() => !!productId.value)

const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')

const form = ref({
  name: '',
  sku: '',
  barcode: '',
  description: '',
  category: '',
  price: 0,
  cost: null as number | null,
  quantity_in_stock: 0,
  reorder_threshold: null as number | null,
  tax_percentage: null as number | null,
  tax_fixed: null as number | null,
  expiry_date: '',
  is_active: true
})

const tomorrow = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
})

const generateSKU = () => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `PRD-${timestamp}${random}`
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'File size must be less than 5MB'
      return
    }
    
    imageFile.value = file
    const reader = new FileReader()
    reader.onloadend = () => {
      imagePreview.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const loadProduct = async () => {
  if (!productId.value) return

  loading.value = true
  error.value = null

  try {
    const response = await $apiService.products.getById(productId.value)
    const product = response.data || response

    form.value = {
      name: product.name || '',
      sku: product.sku || '',
      barcode: product.barcode || '',
      description: product.description || '',
      category: product.category || '',
      price: product.price || 0,
      cost: product.cost || null,
      quantity_in_stock: product.quantity_in_stock ?? product.stock_quantity ?? 0,
      reorder_threshold: product.reorder_threshold ?? product.min_stock_level ?? null,
      tax_percentage: product.tax_percentage || null,
      tax_fixed: product.tax_fixed || null,
      expiry_date: product.expiry_date || '',
      is_active: product.is_active ?? (product.status === 'active')
    }
    
    if (product.image_url) {
      imagePreview.value = product.image_url
    }
  } catch (err: any) {
    console.error('Error loading product:', err)
    error.value = t('products.errorLoadingProduct')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = null

  try {
    const formData = new FormData()
    
    formData.append('name', form.value.name)
    formData.append('sku', form.value.sku)
    if (form.value.barcode) formData.append('barcode', form.value.barcode)
    if (form.value.description) formData.append('description', form.value.description)
    formData.append('category', form.value.category)
    formData.append('price', form.value.price.toString())
    if (form.value.cost !== null) formData.append('cost', form.value.cost.toString())
    formData.append('quantity_in_stock', form.value.quantity_in_stock.toString())
    if (form.value.reorder_threshold !== null) formData.append('reorder_threshold', form.value.reorder_threshold.toString())
    if (form.value.tax_percentage !== null) formData.append('tax_percentage', form.value.tax_percentage.toString())
    if (form.value.tax_fixed !== null) formData.append('tax_fixed', form.value.tax_fixed.toString())
    if (form.value.expiry_date) formData.append('expiry_date', form.value.expiry_date)
    formData.append('is_active', form.value.is_active ? '1' : '0')
    
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    if (isEdit.value && productId.value) {
      await $apiService.products.update(productId.value, formData)
    } else {
      await $apiService.products.create(formData)
    }

    router.push('/products')
  } catch (err: any) {
    error.value = err.response?.data?.message || t('products.errorSaving')
    console.error('Error saving product:', err)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    await loadProduct()
  } else {
    // Generate SKU for new products
    form.value.sku = generateSKU()
  }
})
</script>
