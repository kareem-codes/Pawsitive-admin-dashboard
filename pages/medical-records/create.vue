<template>
  <div class="animate-fade-in max-w-5xl mx-auto">
    <!-- Breadcrumb -->
    <nav class="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink to="/" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
        <Icon name="mdi:home" class="w-4 h-4" />
      </NuxtLink>
      <Icon name="mdi:chevron-right" class="w-4 h-4" />
      <NuxtLink to="/medical-records" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
        {{ t('nav.medicalRecords') }}
      </NuxtLink>
      <Icon name="mdi:chevron-right" class="w-4 h-4" />
      <span class="text-gray-900 dark:text-white font-medium">
        {{ isEdit ? t('medicalRecords.editRecord') : t('medicalRecords.addRecord') }}
      </span>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {{ isEdit ? t('medicalRecords.editRecord') : t('medicalRecords.addRecord') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ isEdit ? t('medicalRecords.editSubtitle') : t('medicalRecords.createSubtitle') }}
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
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800">
      <div class="space-y-6">
        <!-- Owner Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('appointments.owner') }} <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.owner_id"
            required
            :disabled="loading"
            @change="onOwnerChange"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
            <option value="">{{ t('appointments.selectOwner') }}</option>
            <option v-for="owner in owners" :key="owner.id" :value="owner.id">
              {{ owner.name }} - {{ owner.email }}
            </option>
          </select>
        </div>

        <!-- Pet Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('pets.pet') }} <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.pet_id"
            required
            :disabled="loading || !form.owner_id || loadingPets"
            @change="onPetChange"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="">{{ form.owner_id ? t('medicalRecords.selectPet') : t('medicalRecords.selectOwnerFirst') }}</option>
            <option v-for="pet in ownerPets" :key="pet.id" :value="pet.id">
              {{ pet.name }} - {{ pet.species }}
            </option>
          </select>
          <p v-if="loadingPets" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Icon name="mdi:loading" class="w-3 h-3 animate-spin inline" /> {{ t('common.loading') }}
          </p>
        </div>

        <!-- Veterinarian Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('medicalRecords.veterinarian') }} <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.veterinarian_id"
            required
            :disabled="loading"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
            <option value="">{{ t('medicalRecords.selectVeterinarian') }}</option>
            <option v-for="vet in veterinarians" :key="vet.id" :value="vet.id">
              {{ vet.name }}
            </option>
          </select>
        </div>

        <!-- Visit Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('medicalRecords.visitDate') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.visit_date"
            type="date"
            required
            :disabled="loading"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
        </div>

        <!-- Appointment (Optional) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('medicalRecords.appointment') }}
          </label>
          <select
            v-model="form.appointment_id"
            :disabled="loading || !form.pet_id || loadingAppointments"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="">{{ form.pet_id ? t('medicalRecords.selectAppointment') : t('medicalRecords.selectPetFirst') }}</option>
            <option v-for="appointment in petAppointments" :key="appointment.id" :value="appointment.id">
              {{ formatDate(appointment.appointment_date) }} - {{ appointment.reason || 'Appointment' }}
            </option>
          </select>
          <p v-if="loadingAppointments" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Icon name="mdi:loading" class="w-3 h-3 animate-spin inline" /> {{ t('common.loading') }}
          </p>
        </div>

        <!-- Weight & Temperature Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Weight -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('medicalRecords.weight') }} (kg)
            </label>
            <input
              v-model.number="form.weight"
              type="number"
              step="0.01"
              min="0"
              :disabled="loading"
              placeholder="e.g., 5.5"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Temperature -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('medicalRecords.temperature') }} (°C)
            </label>
            <input
              v-model.number="form.temperature"
              type="number"
              step="0.1"
              min="0"
              max="50"
              :disabled="loading"
              placeholder="e.g., 38.5"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>
        </div>

        <!-- Diagnosis -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('medicalRecords.diagnosis') }}
          </label>
          <textarea
            v-model="form.diagnosis"
            rows="3"
            :disabled="loading"
            :placeholder="t('medicalRecords.diagnosisPlaceholder')"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all resize-none"></textarea>
        </div>

        <!-- Treatment -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('medicalRecords.treatment') }}
          </label>
          <textarea
            v-model="form.treatment"
            rows="3"
            :disabled="loading"
            :placeholder="t('medicalRecords.treatmentPlaceholder')"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all resize-none"></textarea>
        </div>

        <!-- Prescriptions -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('medicalRecords.prescriptions') }}
          </label>
          <textarea
            v-model="form.prescriptions"
            rows="3"
            :disabled="loading"
            :placeholder="t('medicalRecords.prescriptionsPlaceholder')"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all resize-none"></textarea>
        </div>

        <!-- Procedures -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('medicalRecords.procedures') }}
          </label>
          <textarea
            v-model="form.procedures"
            rows="3"
            :disabled="loading"
            :placeholder="t('medicalRecords.proceduresPlaceholder')"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all resize-none"></textarea>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('common.notes') }}
          </label>
          <textarea
            v-model="form.notes"
            rows="4"
            :disabled="loading"
            :placeholder="t('medicalRecords.notesPlaceholder')"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all resize-none"></textarea>
        </div>

        <!-- Next Visit Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('medicalRecords.nextVisitDate') }}
          </label>
          <input
            v-model="form.next_visit_date"
            type="date"
            :disabled="loading"
            :min="form.visit_date"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
        <button
          type="submit"
          :disabled="saving || loading"
          class="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Icon v-if="saving" name="mdi:loading" class="w-5 h-5 animate-spin" />
          <Icon v-else name="mdi:content-save" class="w-5 h-5" />
          {{ saving ? t('common.saving') : (isEdit ? t('common.update') : t('common.create')) }}
        </button>
        <button
          type="button"
          @click="router.push('/medical-records')"
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
import type { Pet, User, Appointment, Owner } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()

const recordId = computed(() => route.query.id ? Number(route.query.id) : null)
const isEdit = computed(() => !!recordId.value)

const loading = ref(false)
const saving = ref(false)
const loadingPets = ref(false)
const loadingAppointments = ref(false)
const error = ref<string | null>(null)

const owners = ref<Owner[]>([])
const ownerPets = ref<Pet[]>([])
const petAppointments = ref<Appointment[]>([])
const veterinarians = ref<User[]>([])

const form = ref({
  owner_id: '',
  pet_id: '',
  veterinarian_id: '',
  appointment_id: '',
  visit_date: new Date().toISOString().split('T')[0],
  weight: null as number | null,
  temperature: null as number | null,
  diagnosis: '',
  treatment: '',
  prescriptions: '',
  procedures: '',
  notes: '',
  next_visit_date: ''
})

const loadOwners = async () => {
  try {
    const response = await $apiService.owners.getAll({ per_page: 1000 })
    owners.value = response.data
  } catch (err: any) {
    console.error('Error loading owners:', err)
    error.value = t('medicalRecords.errorLoadingOwners')
  }
}

const loadOwnerPets = async (ownerId: number) => {
  loadingPets.value = true
  ownerPets.value = []
  form.value.pet_id = ''
  form.value.appointment_id = ''
  petAppointments.value = []
  
  try {
    const response = await $apiService.pets.getAll({ 
      user_id: ownerId,
      per_page: 1000 
    })
    ownerPets.value = response.data
  } catch (err: any) {
    console.error('Error loading owner pets:', err)
    error.value = t('medicalRecords.errorLoadingPets')
  } finally {
    loadingPets.value = false
  }
}

const loadPetAppointments = async (petId: number) => {
  loadingAppointments.value = true
  petAppointments.value = []
  form.value.appointment_id = ''
  
  try {
    const response = await $apiService.appointments.getAll({ 
      pet_id: petId,
      per_page: 100
    })
    // Sort by appointment_date descending
    petAppointments.value = (response.data || []).sort((a, b) => {
      return new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime()
    })
  } catch (err: any) {
    console.error('Error loading pet appointments:', err)
  } finally {
    loadingAppointments.value = false
  }
}

const onOwnerChange = () => {
  if (form.value.owner_id) {
    loadOwnerPets(Number(form.value.owner_id))
  } else {
    ownerPets.value = []
    petAppointments.value = []
    form.value.pet_id = ''
    form.value.appointment_id = ''
  }
}

const onPetChange = () => {
  if (form.value.pet_id) {
    loadPetAppointments(Number(form.value.pet_id))
  } else {
    petAppointments.value = []
    form.value.appointment_id = ''
  }
}

const loadVeterinarians = async () => {
  try {
    const { $api } = useNuxtApp()
    const response = await $api.get('/users', { params: { role: 'veterinarian', per_page: 1000 } })
    veterinarians.value = response.data.data || response.data
  } catch (err: any) {
    console.error('Error loading veterinarians:', err)
    error.value = t('medicalRecords.errorLoadingVeterinarians')
  }
}

const loadRecord = async () => {
  if (!recordId.value) return

  loading.value = true
  error.value = null

  try {
    const response = await $apiService.medicalRecords.getById(recordId.value)
    const record = response.data || response

    // Get owner_id from pet relationship
    const ownerId = record.pet?.owner_id

    form.value = {
      owner_id: String(ownerId || ''),
      pet_id: String(record.pet_id || ''),
      veterinarian_id: String(record.veterinarian_id || ''),
      appointment_id: String(record.appointment_id || ''),
      visit_date: record.visit_date || '',
      weight: record.weight || null,
      temperature: record.temperature || null,
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      prescriptions: record.prescriptions || '',
      procedures: record.procedures || '',
      notes: record.notes || '',
      next_visit_date: record.next_visit_date || ''
    }

    // Load related data
    if (ownerId) {
      await loadOwnerPets(ownerId)
      if (record.pet_id) {
        await loadPetAppointments(record.pet_id)
      }
    }
  } catch (err: any) {
    console.error('Error loading medical record:', err)
    error.value = t('medicalRecords.errorLoadingRecord')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = null

  try {
    const data: any = {
      pet_id: Number(form.value.pet_id),
      veterinarian_id: Number(form.value.veterinarian_id),
      appointment_id: form.value.appointment_id ? Number(form.value.appointment_id) : undefined,
      visit_date: form.value.visit_date,
      weight: form.value.weight || undefined,
      temperature: form.value.temperature || undefined,
      diagnosis: form.value.diagnosis || undefined,
      treatment: form.value.treatment || undefined,
      prescriptions: form.value.prescriptions || undefined,
      procedures: form.value.procedures || undefined,
      notes: form.value.notes || undefined,
      next_visit_date: form.value.next_visit_date || undefined
    }

    if (isEdit.value && recordId.value) {
      await $apiService.medicalRecords.update(recordId.value, data)
    } else {
      await $apiService.medicalRecords.create(data)
    }

    router.push('/medical-records')
  } catch (err: any) {
    error.value = err.response?.data?.message || t('medicalRecords.errorSaving')
    console.error('Error saving medical record:', err)
  } finally {
    saving.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  await Promise.all([
    loadOwners(),
    loadVeterinarians()
  ])
  
  if (isEdit.value) {
    await loadRecord()
  }
})
</script>
