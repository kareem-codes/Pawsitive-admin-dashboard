<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {{ isEdit ? t('appointments.editAppointment') : t('appointments.newAppointment') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('appointments.createSubtitle') }}</p>
        </div>
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

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Main Information -->
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">{{ t('appointments.basicInfo') }}</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Pet Owner -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('appointments.owner') }} <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <select
                v-model="form.owner_id"
                required
                @change="loadOwnerPets"
                class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
                <option value="">{{ t('appointments.selectOwner') }}</option>
                <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                  {{ owner.name }} - {{ owner.email }}
                </option>
              </select>
              <button
                type="button"
                @click="showOwnerModal = true"
                class="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all flex items-center justify-center"
                :title="t('appointments.addNewOwner') || 'Add new owner'">
                <Icon name="mdi:plus" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Pet -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('appointments.pet') }} <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <select
                v-model="form.pet_id"
                required
                :disabled="!form.owner_id || loadingPets"
                class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">{{ loadingPets ? t('common.loading') : t('appointments.selectPet') }}</option>
                <option v-for="pet in ownerPets" :key="pet.id" :value="pet.id">
                  {{ pet.name }} - {{ pet.species }}
                </option>
              </select>
              <button
                type="button"
                @click="showPetModal = true"
                :disabled="!form.owner_id"
                class="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                :title="t('appointments.addNewPet') || 'Add new pet'">
                <Icon name="mdi:plus" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Appointment Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('appointments.date') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.appointment_date"
              type="date"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Appointment Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('appointments.time') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.appointment_time"
              type="time"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('appointments.type') }} <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.type"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
              <option value="">{{ t('appointments.selectType') }}</option>
              <option value="checkup">{{ t('appointments.checkup') }}</option>
              <option value="vaccination">{{ t('appointments.vaccination') }}</option>
              <option value="surgery">{{ t('appointments.surgery') }}</option>
              <option value="grooming">{{ t('appointments.grooming') }}</option>
              <option value="emergency">{{ t('appointments.emergency') }}</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Duration -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration (minutes)
            </label>
            <select
              v-model="form.duration_minutes"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <!-- Veterinarian -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Veterinarian <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.veterinarian_id"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
              <option value="">Select Veterinarian</option>
              <option v-for="vet in veterinarians" :key="vet.id" :value="vet.id">
                {{ vet.name }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.status') }} <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
              <option value="pending">Pending</option>
              <option value="confirmed">{{ t('appointments.confirmed') }}</option>
              <option value="completed">{{ t('appointments.completed') }}</option>
              <option value="cancelled">{{ t('appointments.cancelled') }}</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          <!-- Reason -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('appointments.reason') }}
            </label>
            <textarea
              v-model="form.reason"
              rows="3"
              :placeholder="t('appointments.reasonPlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"></textarea>
          </div>

          <!-- Notes -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('appointments.notes') }}
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              :placeholder="t('appointments.notesPlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"></textarea>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="$router.back()"
          class="px-6 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 font-semibold transition-all">
          {{ t('common.cancel') }}
        </button>
        <button
          type="submit"
          :disabled="saving"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <Icon name="mdi:content-save" class="w-5 h-5" />
          {{ saving ? t('common.saving') : (isEdit ? t('common.update') : t('common.save')) }}
        </button>
      </div>
    </form>

    <!-- Owner Form Modal -->
    <OwnerFormModal
      v-model="showOwnerModal"
      @saved="handleOwnerSaved"
    />

    <!-- Pet Form Modal -->
    <PetFormModal
      v-model="showPetModal"
      :owner-id="form.owner_id"
      @saved="handlePetSaved"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { $apiService } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.query.id)
const appointmentId = computed(() => route.query.id ? Number(route.query.id) : null)

const saving = ref(false)
const error = ref<string | null>(null)
const loadingPets = ref(false)
const showOwnerModal = ref(false)
const showPetModal = ref(false)

const owners = ref<any[]>([])
const ownerPets = ref<any[]>([])
const veterinarians = ref<any[]>([])

const form = ref({
  owner_id: '',
  pet_id: '',
  veterinarian_id: '',
  appointment_date: '',
  appointment_time: '',
  duration_minutes: 30,
  type: '',
  status: 'pending',
  reason: '',
  notes: ''
})

// Load owners and veterinarians on mount
onMounted(async () => {
  await Promise.all([loadOwners(), loadVeterinarians()])
  if (isEdit.value && appointmentId.value) {
    await loadAppointment()
  } else {
    // Set default date to today
    const today = new Date()
    form.value.appointment_date = today.toISOString().split('T')[0] || ''
  }
})

const loadVeterinarians = async () => {
  try {
    // Load users with veterinarian role
    const { $api } = useNuxtApp()
    const response = await $api.get('/users', { params: { role: 'veterinarian', per_page: 1000 } })
    veterinarians.value = response.data.data || response.data
  } catch (err: any) {
    console.error('Error loading veterinarians:', err)
  }
}

const loadOwners = async () => {
  try {
    const response = await $apiService.owners.getAll({ per_page: 1000 })
    owners.value = response.data
  } catch (err: any) {
    console.error('Error loading owners:', err)
    error.value = t('appointments.errorLoadingOwners')
  }
}

const loadOwnerPets = async () => {
  if (!form.value.owner_id) {
    ownerPets.value = []
    form.value.pet_id = ''
    return
  }

  loadingPets.value = true
  try {
    const response = await $apiService.pets.getAll({ 
      owner_id: Number(form.value.owner_id),
      per_page: 1000 
    })
    ownerPets.value = response.data
  } catch (err: any) {
    console.error('Error loading pets:', err)
    error.value = t('appointments.errorLoadingPets')
  } finally {
    loadingPets.value = false
  }
}

const loadAppointment = async () => {
  try {
    const response = await $apiService.appointments.getById(appointmentId.value!)
    const appointment = response.data
    
    // Split appointment_date (datetime) into date and time parts
    const dateTime = new Date(appointment.appointment_date)
    const date = dateTime.toISOString().split('T')[0]
    const time = dateTime.toTimeString().slice(0, 5)
    
    form.value = {
      owner_id: appointment.pet?.owner_id?.toString() || String((appointment as any).user_id || ''),
      pet_id: appointment.pet_id?.toString() || '',
      veterinarian_id: (appointment as any).veterinarian_id?.toString() || '',
      appointment_date: date || '',
      appointment_time: time || '',
      duration_minutes: (appointment as any).duration_minutes || 30,
      type: (appointment as any).type || '',
      status: appointment.status || 'pending',
      reason: appointment.reason || '',
      notes: appointment.notes || ''
    }

    // Load pets for the owner
    if (form.value.owner_id) {
      await loadOwnerPets()
    }
  } catch (err: any) {
    console.error('Error loading appointment:', err)
    error.value = t('appointments.errorLoadingAppointment')
  }
}

const handleOwnerSaved = async (newOwner: any) => {
  try {
    // Reload owners list to include the new owner
    await loadOwners()
    
    // Auto-select the newly created owner
    form.value.owner_id = newOwner.id.toString()
    
    // Load pets for the new owner (in case they were added during owner creation)
    await loadOwnerPets()
    
    // Show success feedback
    console.log('Owner created and selected:', newOwner.name)
  } catch (err) {
    console.error('Error after saving owner:', err)
  }
}

const handlePetSaved = async (newPet: any) => {
  try {
    // Reload pets list for the current owner to include the new pet
    await loadOwnerPets()
    
    // Auto-select the newly created pet
    form.value.pet_id = newPet.id.toString()
    
    // Show success feedback
    console.log('Pet created and selected:', newPet.name)
  } catch (err) {
    console.error('Error after saving pet:', err)
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = null

  try {
    // Combine date and time into a datetime string
    const appointmentDateTime = `${form.value.appointment_date} ${form.value.appointment_time}:00`

    const data: any = {
      pet_id: Number(form.value.pet_id),
      user_id: Number(form.value.owner_id),
      veterinarian_id: Number(form.value.veterinarian_id),
      appointment_date: appointmentDateTime,
      duration_minutes: Number(form.value.duration_minutes),
      type: form.value.type,
      status: form.value.status,
      reason: form.value.reason || undefined,
      notes: form.value.notes || undefined
    }

    if (isEdit.value && appointmentId.value) {
      await $apiService.appointments.update(appointmentId.value, data)
    } else {
      await $apiService.appointments.create(data)
    }

    router.push('/appointments')
  } catch (err: any) {
    error.value = err.response?.data?.message || t('appointments.errorSaving')
    console.error('Error saving appointment:', err)
  } finally {
    saving.value = false
  }
}
</script>
