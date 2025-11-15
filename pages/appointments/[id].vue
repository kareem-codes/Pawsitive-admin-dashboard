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
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {{ t('appointments.title') }} {{ t('appointments.details') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ formatDate(appointment?.appointment_date) }} {{ t('appointments.at') }} {{ appointment?.appointment_time || formatTime(appointment?.appointment_date) }}
          </p>
        </div>
        <div class="flex flex-wrap gap-2 sm:gap-3">
          <button
            v-if="appointment?.status === 'pending'"
            @click="confirmAppointment"
            class="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base font-semibold">
            <Icon name="mdi:check" class="w-4 h-4 sm:w-5 sm:h-5" />
            {{ t('appointments.confirm') }}
          </button>
          <button
            v-if="appointment?.status === 'confirmed'"
            @click="completeAppointment"
            class="flex items-center gap-1.5 sm:gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base font-semibold">
            <Icon name="mdi:check-all" class="w-4 h-4 sm:w-5 sm:h-5" />
            {{ t('appointments.complete') }}
          </button>
          <button
            v-if="appointment && ['pending', 'confirmed'].includes(appointment.status)"
            @click="cancelAppointment"
            class="flex items-center gap-1.5 sm:gap-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base font-semibold">
            <Icon name="mdi:close" class="w-4 h-4 sm:w-5 sm:h-5" />
            {{ t('common.cancel') }}
          </button>
          <NuxtLink
            :to="`/appointments/create?id=${route.params.id}`"
            class="flex items-center gap-1.5 sm:gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base font-semibold">
            <Icon name="mdi:pencil" class="w-4 h-4 sm:w-5 sm:h-5" />
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

    <!-- Appointment Details -->
    <div v-else-if="appointment" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Status Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="mdi:information" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              {{ t('appointments.statusInformation') }}
            </h2>
            <span
              :class="{
                'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400': appointment.status === 'pending',
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': appointment.status === 'confirmed',
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': appointment.status === 'completed',
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': appointment.status === 'cancelled',
                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': appointment.status === 'no_show',
              }"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold capitalize">
              <Icon :name="getStatusIcon(appointment.status)" class="w-4 h-4" />
              {{ t(`appointments.${appointment.status}`) }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('appointments.dateTime') }}
              </label>
              <div class="flex items-center gap-2">
                <Icon name="mdi:calendar-clock" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <p class="text-base font-semibold text-gray-900 dark:text-white">
                  {{ formatDate(appointment.appointment_date) }} at {{ appointment.appointment_time || formatTime(appointment.appointment_date) }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('appointments.type') }}
              </label>
              <div class="flex items-center gap-2">
                <Icon :name="getTypeIcon(appointment.type)" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <p class="text-base font-semibold text-gray-900 dark:text-white capitalize">
                  {{ appointment.type ? t(`appointments.${appointment.type}`) : 'N/A' }}
                </p>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('appointments.reason') }}
              </label>
              <p class="text-base text-gray-900 dark:text-white">
                {{ appointment.reason || '-' }}
              </p>
            </div>

            <div v-if="appointment.notes" class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('common.notes') }}
              </label>
              <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">
                {{ appointment.notes }}
              </p>
            </div>
          </div>
        </div>

        <!-- Pet Information -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:paw" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            {{ t('appointments.petInformation') }}
          </h2>

          <div v-if="appointment.pet" class="space-y-4">
            <div class="flex items-center gap-4">
              <div v-if="appointment.pet.photo_url" class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                <img :src="appointment.pet.photo_url" :alt="appointment.pet.name" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center flex-shrink-0">
                <Icon name="mdi:paw" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ appointment.pet.name }}</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ appointment.pet.species }} - {{ appointment.pet.breed }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ t('appointments.gender') }}</label>
                <p class="text-base font-semibold text-gray-900 dark:text-white capitalize">{{ appointment.pet.gender }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ t('appointments.age') }}</label>
                <p class="text-base font-semibold text-gray-900 dark:text-white">{{ appointment.pet.age || 'N/A' }} years</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ t('appointments.weight') }}</label>
                <p class="text-base font-semibold text-gray-900 dark:text-white">{{ appointment.pet.weight || 'N/A' }} kg</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ t('appointments.color') }}</label>
                <p class="text-base font-semibold text-gray-900 dark:text-white">{{ appointment.pet.color || 'N/A' }}</p>
              </div>
            </div>

            <div v-if="appointment.pet.allergies" class="pt-4 border-t border-gray-200 dark:border-zinc-800">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ t('appointments.allergies') }}</label>
              <div class="flex items-start gap-2">
                <Icon name="mdi:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <p class="text-base text-red-600 dark:text-red-400">{{ appointment.pet.allergies }}</p>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200 dark:border-zinc-800">
              <NuxtLink
                :to="`/pets/${appointment.pet.id}`"
                class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors">
                {{ t('appointments.viewPetProfile') }}
                <Icon name="mdi:arrow-right" class="w-5 h-5" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Diagnosis & Treatment (if completed) -->
        <div v-if="appointment.status === 'completed' && (appointment.diagnosis || appointment.treatment)" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:clipboard-text" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            {{ t('appointments.diagnosisAndTreatment') }}
          </h2>

          <div class="space-y-4">
            <div v-if="appointment.diagnosis">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ t('appointments.diagnosis') }}</label>
              <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ appointment.diagnosis }}</p>
            </div>

            <div v-if="appointment.treatment">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ t('appointments.treatment') }}</label>
              <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ appointment.treatment }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Owner Information -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:account" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {{ t('appointments.ownerInformation') }}
          </h2>

          <div v-if="appointment.owner" class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 flex items-center justify-center">
                <Icon name="mdi:account" class="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ appointment.owner.name }}</h3>
              </div>
            </div>

            <div class="space-y-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
              <div class="flex items-center gap-3">
                <Icon name="mdi:email" class="w-5 h-5 text-gray-400" />
                <a :href="`mailto:${appointment.owner.email}`" class="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                  {{ appointment.owner.email }}
                </a>
              </div>
              <div class="flex items-center gap-3">
                <Icon name="mdi:phone" class="w-5 h-5 text-gray-400" />
                <a :href="`tel:${appointment.owner.phone}`" class="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                  {{ appointment.owner.phone }}
                </a>
              </div>
              <div v-if="appointment.owner.address" class="flex items-start gap-3">
                <Icon name="mdi:map-marker" class="w-5 h-5 text-gray-400 mt-0.5" />
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ appointment.owner.address }}</p>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200 dark:border-zinc-800">
              <NuxtLink
                :to="`/owners/${appointment.owner.id}`"
                class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold text-sm transition-colors">
                {{ t('appointments.viewOwnerProfile') }}
                <Icon name="mdi:arrow-right" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Veterinarian Information -->
        <div v-if="appointment.veterinarian" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:doctor" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            {{ t('appointments.veterinarianInfo') }}
          </h2>

          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                <Icon name="mdi:doctor" class="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ appointment.veterinarian.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ appointment.veterinarian.email }}</p>
              </div>
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
              v-if="appointment.pet_id"
              :to="`/medical-records/create?pet_id=${appointment.pet_id}&appointment_id=${appointment.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:file-document-plus" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('appointments.addMedicalRecord') }}</span>
            </NuxtLink>

            <NuxtLink
              v-if="appointment.owner_id"
              :to="`/invoices/create?owner_id=${appointment.owner_id}&appointment_id=${appointment.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:receipt-text" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('appointments.createInvoice') }}</span>
            </NuxtLink>

            <button
              @click="rescheduleAppointment"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:calendar-refresh" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('appointments.reschedule') }}</span>
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
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDateTime(appointment.created_at) }}</p>
              </div>
            </div>
            <div v-if="appointment.updated_at !== appointment.created_at" class="flex items-start gap-3">
              <Icon name="mdi:update" class="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('appointments.lastUpdated') }}</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDateTime(appointment.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-16 text-center border border-gray-100 dark:border-zinc-800">
      <Icon name="mdi:alert-circle" class="w-24 h-24 mx-auto text-red-300 dark:text-red-600 mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('appointments.appointmentNotFound') }}</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('appointments.appointmentNotFoundDesc') }}</p>
      <NuxtLink
        to="/appointments"
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
        <Icon name="mdi:arrow-left" class="w-5 h-5" />
        {{ t('appointments.backToAppointments') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Appointment } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()

const loading = ref(true)
const appointment = ref<Appointment | null>(null)

const fetchAppointment = async () => {
  loading.value = true
  try {
    const response = await $apiService.appointments.getById(Number(route.params.id))
    appointment.value = response.data
  } catch (error) {
    console.error('Error fetching appointment:', handleError(error))
  } finally {
    loading.value = false
  }
}

const confirmAppointment = async () => {
  if (!appointment.value) return
  
  try {
    await $apiService.appointments.confirm(appointment.value.id)
    await fetchAppointment()
  } catch (error) {
    console.error('Error confirming appointment:', handleError(error))
  }
}

const completeAppointment = async () => {
  if (!appointment.value) return
  
  try {
    await $apiService.appointments.complete(appointment.value.id)
    await fetchAppointment()
  } catch (error) {
    console.error('Error completing appointment:', handleError(error))
  }
}

const cancelAppointment = async () => {
  if (!appointment.value) return
  
  if (!confirm(t('appointments.cancelConfirm'))) {
    return
  }
  
  try {
    await $apiService.appointments.cancel(appointment.value.id)
    await fetchAppointment()
  } catch (error) {
    console.error('Error cancelling appointment:', handleError(error))
  }
}

const rescheduleAppointment = () => {
  router.push(`/appointments/create?id=${route.params.id}&reschedule=true`)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusIcon = (status: string) => {
  const icons: { [key: string]: string } = {
    'pending': 'mdi:clock-outline',
    'confirmed': 'mdi:check-circle',
    'completed': 'mdi:check-all',
    'cancelled': 'mdi:close-circle',
    'no_show': 'mdi:account-remove'
  }
  return icons[status] || 'mdi:circle'
}

const getTypeIcon = (type?: string) => {
  if (!type) return 'mdi:calendar'
  
  const icons: { [key: string]: string } = {
    'checkup': 'mdi:stethoscope',
    'vaccination': 'mdi:needle',
    'surgery': 'mdi:medical-bag',
    'grooming': 'mdi:content-cut',
    'dental': 'mdi:tooth',
    'emergency': 'mdi:alert-circle',
    'followup': 'mdi:calendar-sync'
  }
  return icons[type] || 'mdi:calendar'
}

onMounted(() => {
  fetchAppointment()
})
</script>
