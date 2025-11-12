<template>
  <div class="animate-fade-in max-w-6xl mx-auto">
    <!-- Breadcrumb -->
    <nav class="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink to="/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        <Icon name="mdi:home" class="w-4 h-4" />
      </NuxtLink>
      <Icon name="mdi:chevron-right" class="w-4 h-4" />
      <NuxtLink to="/invoices" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        {{ t('nav.invoices') }}
      </NuxtLink>
      <Icon name="mdi:chevron-right" class="w-4 h-4" />
      <span class="text-gray-900 dark:text-white font-medium">
        {{ isEdit ? t('invoices.editInvoice') : t('invoices.createInvoice') }}
      </span>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {{ isEdit ? t('invoices.editInvoice') : t('invoices.createInvoice') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ isEdit ? t('invoices.editSubtitle') : t('invoices.createSubtitle') }}
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
      <!-- Invoice Header Card -->
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Icon name="mdi:file-document-outline" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          {{ t('invoices.invoiceDetails') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Invoice Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('invoices.invoiceNumber') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.invoice_number"
              type="text"
              required
              :disabled="loading"
              :placeholder="t('invoices.invoiceNumberPlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('invoices.status') }} <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              :disabled="loading"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
              <option value="draft">{{ t('invoices.draft') }}</option>
              <option value="pending">{{ t('invoices.pending') }}</option>
              <option value="paid">{{ t('invoices.paid') }}</option>
              <option value="partially_paid">{{ t('invoices.partiallyPaid') }}</option>
              <option value="overdue">{{ t('invoices.overdue') }}</option>
              <option value="cancelled">{{ t('invoices.cancelled') }}</option>
            </select>
          </div>

          <!-- Owner Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('appointments.owner') }} <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.user_id"
              required
              :disabled="loading"
              @change="onOwnerChange"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
              <option value="">{{ t('appointments.selectOwner') }}</option>
              <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                {{ owner.name }} - {{ owner.email }}
              </option>
            </select>
          </div>

          <!-- Pet Selection (Optional) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('pets.pet') }}
            </label>
            <select
              v-model="form.pet_id"
              :disabled="loading || !form.user_id || loadingPets"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="">{{ form.user_id ? t('invoices.selectPet') : t('medicalRecords.selectOwnerFirst') }}</option>
              <option v-for="pet in ownerPets" :key="pet.id" :value="pet.id">
                {{ pet.name }} - {{ pet.species }}
              </option>
            </select>
          </div>

          <!-- Invoice Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('invoices.invoiceDate') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.invoice_date"
              type="date"
              required
              :disabled="loading"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Due Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('invoices.dueDate') }}
            </label>
            <input
              v-model="form.due_date"
              type="date"
              :disabled="loading"
              :min="form.invoice_date"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>
        </div>

        <!-- Notes -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('common.notes') }}
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            :disabled="loading"
            :placeholder="t('invoices.notesPlaceholder')"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all resize-none"></textarea>
        </div>
      </div>

      <!-- Invoice Items Card -->
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="mdi:format-list-bulleted" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {{ t('invoices.items') }}
          </h2>
          <button
            type="button"
            @click="addItem"
            :disabled="loading"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-all text-sm">
            <Icon name="mdi:plus-circle" class="w-4 h-4" />
            {{ t('invoices.addItem') }}
          </button>
        </div>

        <!-- Items List -->
        <div v-if="form.items.length === 0" class="text-center py-12 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl">
          <Icon name="mdi:package-variant-closed" class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <p class="text-gray-500 dark:text-gray-400 mb-4">{{ t('invoices.noItems') }}</p>
          <button
            type="button"
            @click="addItem"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all">
            <Icon name="mdi:plus-circle" class="w-5 h-5" />
            {{ t('invoices.addFirstItem') }}
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(item, index) in form.items"
            :key="index"
            class="p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <!-- Item Type -->
              <div class="md:col-span-2">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('invoices.itemType') }}
                </label>
                <select
                  v-model="item.type"
                  required
                  :disabled="loading"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-900 dark:text-white transition-all">
                  <option value="service">{{ t('invoices.service') }}</option>
                  <option value="product">{{ t('invoices.product') }}</option>
                  <option value="consultation">{{ t('invoices.consultation') }}</option>
                </select>
              </div>

              <!-- Item Name -->
              <div class="md:col-span-3">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('invoices.itemName') }} <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="item.item_name"
                  type="text"
                  required
                  :disabled="loading"
                  :placeholder="t('invoices.itemNamePlaceholder')"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-900 dark:text-white transition-all" />
              </div>

              <!-- Description -->
              <div class="md:col-span-3">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('common.description') }}
                </label>
                <input
                  v-model="item.description"
                  type="text"
                  :disabled="loading"
                  :placeholder="t('invoices.descriptionPlaceholder')"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-900 dark:text-white transition-all" />
              </div>

              <!-- Quantity -->
              <div class="md:col-span-1">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('invoices.qty') }}
                </label>
                <input
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  step="1"
                  required
                  :disabled="loading"
                  @input="calculateItemTotal(item)"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-900 dark:text-white transition-all" />
              </div>

              <!-- Unit Price -->
              <div class="md:col-span-2">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('invoices.unitPrice') }}
                </label>
                <input
                  v-model.number="item.unit_price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  :disabled="loading"
                  @input="calculateItemTotal(item)"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-900 dark:text-white transition-all" />
              </div>

              <!-- Delete Button -->
              <div class="md:col-span-1 flex items-end">
                <button
                  type="button"
                  @click="removeItem(index)"
                  :disabled="loading"
                  class="w-full px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all disabled:opacity-50"
                  :title="t('common.delete')">
                  <Icon name="mdi:delete" class="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            <!-- Item Total -->
            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-700 flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('invoices.itemTotal') }}:</span>
              <span class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(getItemTotal(item)) }}</span>
            </div>
          </div>
        </div>

        <!-- Invoice Summary -->
        <div v-if="form.items.length > 0" class="mt-6 pt-6 border-t-2 border-gray-200 dark:border-zinc-700">
          <div class="max-w-md ml-auto space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('invoices.subtotal') }}:</span>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-zinc-700">
              <span class="text-base font-bold text-gray-900 dark:text-white">{{ t('invoices.total') }}:</span>
              <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ formatCurrency(subtotal) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          type="submit"
          :disabled="saving || loading || form.items.length === 0"
          class="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Icon v-if="saving" name="mdi:loading" class="w-5 h-5 animate-spin" />
          <Icon v-else name="mdi:content-save" class="w-5 h-5" />
          {{ saving ? t('common.saving') : (isEdit ? t('common.update') : t('common.create')) }}
        </button>
        <button
          type="button"
          @click="router.push('/invoices')"
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
import type { Owner, Pet } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()

const invoiceId = computed(() => route.query.id ? Number(route.query.id) : null)
const isEdit = computed(() => !!invoiceId.value)

const loading = ref(false)
const saving = ref(false)
const loadingPets = ref(false)
const error = ref<string | null>(null)

const owners = ref<Owner[]>([])
const ownerPets = ref<Pet[]>([])

interface InvoiceItem {
  type: 'service' | 'product' | 'consultation'
  item_name: string
  description: string
  quantity: number
  unit_price: number
  product_id?: number
  tax_percentage?: number
  tax_fixed?: number
  discount_percentage?: number
  discount_amount?: number
}

const form = ref({
  invoice_number: '',
  user_id: '',
  pet_id: '',
  appointment_id: '',
  invoice_date: new Date().toISOString().split('T')[0],
  due_date: '',
  status: 'draft' as 'draft' | 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled',
  notes: '',
  items: [] as InvoiceItem[]
})

const subtotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + getItemTotal(item), 0)
})

const loadOwners = async () => {
  try {
    const response = await $apiService.owners.getAll({ per_page: 1000 })
    owners.value = response.data
  } catch (err: any) {
    console.error('Error loading owners:', err)
    error.value = t('invoices.errorLoadingOwners')
  }
}

const loadOwnerPets = async (ownerId: number) => {
  loadingPets.value = true
  ownerPets.value = []
  form.value.pet_id = ''
  
  try {
    const response = await $apiService.pets.getAll({ 
      user_id: ownerId,
      per_page: 1000 
    })
    ownerPets.value = response.data
  } catch (err: any) {
    console.error('Error loading owner pets:', err)
  } finally {
    loadingPets.value = false
  }
}

const onOwnerChange = () => {
  if (form.value.user_id) {
    loadOwnerPets(Number(form.value.user_id))
  } else {
    ownerPets.value = []
    form.value.pet_id = ''
  }
}

const addItem = () => {
  form.value.items.push({
    type: 'service',
    item_name: '',
    description: '',
    quantity: 1,
    unit_price: 0
  })
}

const removeItem = (index: number) => {
  form.value.items.splice(index, 1)
}

const getItemTotal = (item: InvoiceItem): number => {
  return (item.quantity || 0) * (item.unit_price || 0)
}

const calculateItemTotal = (item: InvoiceItem) => {
  // This will trigger reactivity
  item.quantity = item.quantity || 0
  item.unit_price = item.unit_price || 0
}

const generateInvoiceNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `INV-${year}${month}-${random}`
}

const loadInvoice = async () => {
  if (!invoiceId.value) return

  loading.value = true
  error.value = null

  try {
    const response = await $apiService.invoices.getById(invoiceId.value)
    const invoice = response.data || response


    form.value = {
      invoice_number: invoice.invoice_number || '',
      user_id: String(invoice.user_id || invoice.owner_id || ''),
      pet_id: String(invoice.pet_id || ''),
      appointment_id: String(invoice.appointment_id || ''),
      invoice_date: formatDateForInput(invoice.invoice_date || invoice.issue_date || ''),
      due_date: formatDateForInput(invoice.due_date || ''),
      status: invoice.status || 'draft',
      notes: invoice.notes || '',
      items: (invoice.items || []).map((item: any) => ({
        type: item.type || 'service',
        item_name: item.item_name || item.description || '',
        description: item.description || '',
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        product_id: item.product_id
      }))
    }

    // Load owner pets if owner is set
    if (form.value.user_id) {
      await loadOwnerPets(Number(form.value.user_id))
    }
  } catch (err: any) {
    console.error('Error loading invoice:', err)
    error.value = t('invoices.errorLoadingInvoice')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = null

  try {
    const data: any = {
      invoice_number: form.value.invoice_number,
      user_id: Number(form.value.user_id),
      pet_id: form.value.pet_id ? Number(form.value.pet_id) : undefined,
      appointment_id: form.value.appointment_id ? Number(form.value.appointment_id) : undefined,
      invoice_date: form.value.invoice_date,
      due_date: form.value.due_date || undefined,
      status: form.value.status,
      notes: form.value.notes || undefined,
      created_by: 1, // TODO: Get from auth user
      items: form.value.items.map(item => ({
        type: item.type,
        item_name: item.item_name,
        description: item.description || item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        product_id: item.product_id || undefined,
        tax_percentage: item.tax_percentage || undefined,
        tax_fixed: item.tax_fixed || undefined,
        discount_percentage: item.discount_percentage || undefined,
        discount_amount: item.discount_amount || undefined
      }))
    }

    if (isEdit.value && invoiceId.value) {
      await $apiService.invoices.update(invoiceId.value, data)
    } else {
      await $apiService.invoices.create(data)
    }

    router.push('/invoices')
  } catch (err: any) {
    error.value = err.response?.data?.message || t('invoices.errorSaving')
    console.error('Error saving invoice:', err)
  } finally {
    saving.value = false
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDateForInput = (dateString: string): string => {
  if (!dateString) return ''
  try {
    // Handle both 'YYYY-MM-DD' and 'YYYY-MM-DDTHH:mm:ss' formats
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    return ''
  }
}

onMounted(async () => {
  await loadOwners()
  
  if (isEdit.value) {
    await loadInvoice()
  } else {
    // Generate invoice number for new invoices
    form.value.invoice_number = generateInvoiceNumber()
  }
})
</script>
