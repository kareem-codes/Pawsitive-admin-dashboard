<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8">
      <button
        @click="router.back()"
        class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
        <Icon name="mdi:arrow-left" class="w-5 h-5" />
        {{ t('common.goBack') }}
      </button>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-4">
          <div v-if="pet?.image_url" class="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800">
            <img :src="pet.image_url" :alt="pet.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
            <Icon name="mdi:paw" class="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {{ pet?.name || t('pets.title') }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              {{ pet?.species }} - {{ pet?.breed }}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <NuxtLink
            :to="`/appointments/create?pet_id=${route.params.id}`"
            class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
            <Icon name="mdi:calendar-plus" class="w-5 h-5" />
            {{ t('pets.bookAppointment') }}
          </NuxtLink>
          <NuxtLink
            :to="`/pets/create?id=${route.params.id}`"
            class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
            <Icon name="mdi:pencil" class="w-5 h-5" />
            {{ t('common.edit') }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <Icon name="mdi:loading" class="w-12 h-12 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">{{ t('common.loading') }}</p>
    </div>

    <!-- Pet Details -->
    <div v-else-if="pet" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Information Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="mdi:information" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              {{ t('pets.basicInfo') }}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('pets.name') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white">{{ pet.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('pets.species') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white capitalize">{{ pet.species }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('pets.breed') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white">{{ pet.breed }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('pets.gender') }}
              </label>
              <div class="flex items-center gap-2">
                <Icon :name="pet.gender === 'male' ? 'mdi:gender-male' : 'mdi:gender-female'" 
                  :class="pet.gender === 'male' ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'" 
                  class="w-5 h-5" />
                <p class="text-base font-semibold text-gray-900 dark:text-white capitalize">{{ t(`pets.${pet.gender}`) }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('pets.age') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white">
                {{ pet.age ? `${pet.age} ${t('pets.years')}` : 'N/A' }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('pets.weight') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white">
                {{ pet.weight ? `${pet.weight} kg` : 'N/A' }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('pets.color') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white">{{ pet.color || 'N/A' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('pets.microchipId') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white font-mono">{{ pet.microchip_id || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Medical Information Card -->
        <div v-if="pet.allergies || pet.medical_history" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:medical-bag" class="w-6 h-6 text-red-600 dark:text-red-400" />
            {{ t('pets.medicalInformation') }}
          </h2>

          <div class="space-y-4">
            <div v-if="pet.allergies">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {{ t('pets.allergies') }}
              </label>
              <div class="flex items-start gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <Icon name="mdi:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p class="text-base text-red-900 dark:text-red-100 whitespace-pre-wrap">{{ pet.allergies }}</p>
              </div>
            </div>

            <div v-if="pet.medical_history">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {{ t('pets.medicalHistory') }}
              </label>
              <div class="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ pet.medical_history }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Medical Records -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="mdi:file-document-multiple" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              {{ t('pets.recentMedicalRecords') }}
            </h2>
            <NuxtLink
              :to="`/medical-records?pet_id=${pet.id}`"
              class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold text-sm transition-colors">
              {{ t('common.viewAll') }}
            </NuxtLink>
          </div>

          <div v-if="loadingRecords" class="text-center py-8">
            <Icon name="mdi:loading" class="w-8 h-8 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
          </div>

          <div v-else-if="medicalRecords.length === 0" class="text-center py-8">
            <Icon name="mdi:file-document-outline" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p class="text-gray-500 dark:text-gray-400">{{ t('pets.noMedicalRecords') }}</p>
          </div>

          <div v-else class="space-y-3">
            <NuxtLink
              v-for="record in medicalRecords"
              :key="record.id"
              :to="`/medical-records/${record.id}`"
              class="block p-4 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <Icon name="mdi:calendar" class="w-4 h-4 text-gray-400" />
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatDate(record.visit_date) }}</span>
                  </div>
                  <p v-if="record.diagnosis" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ record.diagnosis }}</p>
                  <div v-if="record.veterinarian" class="flex items-center gap-2 mt-2">
                    <Icon name="mdi:doctor" class="w-4 h-4 text-gray-400" />
                    <span class="text-xs text-gray-500 dark:text-gray-500">{{ record.veterinarian.name }}</span>
                  </div>
                </div>
                <Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Appointments -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="mdi:calendar-clock" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {{ t('pets.upcomingAppointments') }}
            </h2>
            <NuxtLink
              :to="`/appointments?pet_id=${pet.id}`"
              class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold text-sm transition-colors">
              {{ t('common.viewAll') }}
            </NuxtLink>
          </div>

          <div v-if="loadingAppointments" class="text-center py-8">
            <Icon name="mdi:loading" class="w-8 h-8 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
          </div>

          <div v-else-if="appointments.length === 0" class="text-center py-8">
            <Icon name="mdi:calendar-blank" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p class="text-gray-500 dark:text-gray-400">{{ t('pets.noAppointments') }}</p>
          </div>

          <div v-else class="space-y-3">
            <NuxtLink
              v-for="appointment in appointments"
              :key="appointment.id"
              :to="`/appointments/${appointment.id}`"
              class="block p-4 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <Icon name="mdi:calendar" class="w-4 h-4 text-gray-400" />
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ formatDate(appointment.appointment_date) }} {{ t('appointments.at') }} {{ appointment.appointment_time || formatTime(appointment.appointment_date) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ appointment.reason }}</p>
                  <span
                    :class="{
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': appointment.status === 'confirmed',
                      'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400': appointment.status === 'scheduled',
                    }"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mt-2 capitalize">
                    {{ t(`appointments.${appointment.status}`) }}
                  </span>
                </div>
                <Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Owner Information -->
        <div v-if="pet.owner" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:account" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {{ t('pets.ownerInfo') }}
          </h2>

          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 flex items-center justify-center">
                <Icon name="mdi:account" class="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ pet.owner.name }}</h3>
              </div>
            </div>

            <div class="space-y-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
              <div class="flex items-center gap-3">
                <Icon name="mdi:email" class="w-5 h-5 text-gray-400" />
                <a :href="`mailto:${pet.owner.email}`" class="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                  {{ pet.owner.email }}
                </a>
              </div>
              <div class="flex items-center gap-3">
                <Icon name="mdi:phone" class="w-5 h-5 text-gray-400" />
                <a :href="`tel:${pet.owner.phone}`" class="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                  {{ pet.owner.phone }}
                </a>
              </div>
              <div v-if="pet.owner.address" class="flex items-start gap-3">
                <Icon name="mdi:map-marker" class="w-5 h-5 text-gray-400 mt-0.5" />
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ pet.owner.address }}</p>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200 dark:border-zinc-800">
              <NuxtLink
                :to="`/owners/${pet.owner.id}`"
                class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold text-sm transition-colors">
                {{ t('pets.viewOwnerProfile') }}
                <Icon name="mdi:arrow-right" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="mdi:flash" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
            {{ t('appointments.quickActions') }}
          </h2>

          <div class="space-y-3">
            <NuxtLink
              :to="`/appointments/create?pet_id=${pet.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:calendar-plus" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('pets.bookAppointment') }}</span>
            </NuxtLink>

            <NuxtLink
              :to="`/medical-records/create?pet_id=${pet.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:file-document-plus" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('pets.addMedicalRecord') }}</span>
            </NuxtLink>

            <button
              @click="downloadVaccinationCard"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:card-account-details" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('pets.vaccinationCard') }}</span>
            </button>
          </div>
        </div>

        <!-- Timeline -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="mdi:history" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            {{ t('appointments.timeline') }}
          </h2>

          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-3">
              <Icon name="mdi:clock-outline" class="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('appointments.createdAt') }}</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDateTime(pet.created_at) }}</p>
              </div>
            </div>
            <div v-if="pet.updated_at !== pet.created_at" class="flex items-start gap-3">
              <Icon name="mdi:update" class="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('appointments.lastUpdated') }}</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDateTime(pet.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-16 text-center border border-gray-100 dark:border-zinc-800">
      <Icon name="mdi:alert-circle" class="w-24 h-24 mx-auto text-red-300 dark:text-red-600 mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('pets.petNotFound') }}</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('pets.petNotFoundDesc') }}</p>
      <NuxtLink
        to="/pets"
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
        <Icon name="mdi:arrow-left" class="w-5 h-5" />
        {{ t('pets.backToPets') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pet, MedicalRecord, Appointment } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()

const loading = ref(true)
const loadingRecords = ref(true)
const loadingAppointments = ref(true)
const pet = ref<Pet | null>(null)
const medicalRecords = ref<MedicalRecord[]>([])
const appointments = ref<Appointment[]>([])

const fetchPet = async () => {
  loading.value = true
  try {
    const response = await $apiService.pets.getById(Number(route.params.id))
    pet.value = response
  } catch (error) {
    console.error('Error fetching pet:', handleError(error))
  } finally {
    loading.value = false
  }
}

const fetchMedicalRecords = async () => {
  loadingRecords.value = true
  try {
    const response = await $apiService.medicalRecords.getAll({
      pet_id: Number(route.params.id),
      per_page: 5
    })
    medicalRecords.value = response.data
  } catch (error) {
    console.error('Error fetching medical records:', handleError(error))
  } finally {
    loadingRecords.value = false
  }
}

const fetchAppointments = async () => {
  loadingAppointments.value = true
  try {
    const response = await $apiService.appointments.getAll({
      pet_id: Number(route.params.id),
      per_page: 5
    })
    appointments.value = response.data.filter((apt: Appointment) => 
      ['scheduled', 'confirmed', 'in-progress'].includes(apt.status)
    )
  } catch (error) {
    console.error('Error fetching appointments:', handleError(error))
  } finally {
    loadingAppointments.value = false
  }
}

const downloadVaccinationCard = async () => {
  try {
    // TODO: Implement vaccination card download when API is available
    // const response = await $apiService.pets.downloadVaccinationCard(Number(route.params.id))
    // const blob = new Blob([response], { type: 'application/pdf' })
    // const url = window.URL.createObjectURL(blob)
    // const link = document.createElement('a')
    // link.href = url
    // link.download = `vaccination-card-${pet.value?.name}.pdf`
    // link.click()
    // window.URL.revokeObjectURL(url)
    console.log('Vaccination card download feature coming soon')
  } catch (error) {
    console.error('Error downloading vaccination card:', handleError(error))
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}


onMounted(() => {
  fetchPet()
  fetchMedicalRecords()
  fetchAppointments()
})
</script>
