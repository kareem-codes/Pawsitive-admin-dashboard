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
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center">
            <Icon name="mdi:clipboard-text-clock" class="w-10 h-10 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {{ t('medicalRecords.recordDetails') }}
            </h1>
            <p v-if="record" class="text-gray-600 dark:text-gray-400 mt-1">
              {{ record.pet?.name }} - {{ formatDate(record.visit_date || record.created_at) }}
            </p>
          </div>
        </div>
        <NuxtLink
          :to="`/medical-records/create?id=${route.params.id}`"
          class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
          <Icon name="mdi:pencil" class="w-5 h-5" />
          {{ t('common.edit') }}
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <Icon name="mdi:loading" class="w-12 h-12 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">{{ t('common.loading') }}</p>
    </div>

    <!-- Medical Record Details -->
    <div v-else-if="record" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Pet Information Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:paw" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            {{ t('medicalRecords.petInformation') }}
          </h2>

          <div v-if="record.pet" class="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:paw" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ record.pet.name }}</h3>
                <NuxtLink
                  :to="`/pets/${record.pet.id}`"
                  class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold text-sm transition-colors">
                  {{ t('common.viewDetails') }}
                </NuxtLink>
              </div>
              <p class="text-base text-gray-700 dark:text-gray-300 mb-2">{{ record.pet.species }} - {{ record.pet.breed }}</p>
              <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span class="flex items-center gap-1">
                  <Icon :name="record.pet.gender === 'male' ? 'mdi:gender-male' : 'mdi:gender-female'" class="w-4 h-4" />
                  {{ t(`pets.${record.pet.gender}`) }}
                </span>
                <span v-if="record.pet.age">{{ record.pet.age }} {{ t('pets.years') }}</span>
                <span v-if="record.pet.owner">
                  <Icon name="mdi:account" class="w-4 h-4 inline" />
                  {{ record.pet.owner.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Visit Details Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:stethoscope" class="w-6 h-6 text-teal-600 dark:text-teal-400" />
            {{ t('medicalRecords.visitDetails') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('medicalRecords.visitDate') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="mdi:calendar" class="w-4 h-4 text-gray-400" />
                {{ formatDate(record.visit_date) }}
              </p>
            </div>

            <div v-if="record.veterinarian">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('medicalRecords.veterinarian') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="mdi:doctor" class="w-4 h-4 text-gray-400" />
                {{ record.veterinarian.name }}
              </p>
            </div>

            <div v-if="record.weight">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('medicalRecords.weight') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="mdi:weight-kilogram" class="w-4 h-4 text-gray-400" />
                {{ record.weight }} kg
              </p>
            </div>

            <div v-if="record.temperature">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('medicalRecords.temperature') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="mdi:thermometer" class="w-4 h-4 text-gray-400" />
                {{ record.temperature }} °C
              </p>
            </div>

            <div v-if="record.next_visit_date" class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('medicalRecords.nextVisitDate') }}
              </label>
              <p class="text-base font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <Icon name="mdi:calendar-clock" class="w-4 h-4" />
                {{ formatDate(record.next_visit_date) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Diagnosis Card -->
        <div v-if="record.diagnosis" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:clipboard-pulse" class="w-6 h-6 text-red-600 dark:text-red-400" />
            {{ t('medicalRecords.diagnosis') }}
          </h2>

          <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ record.diagnosis }}</p>
          </div>
        </div>

        <!-- Symptoms Card -->
        <div v-if="record.symptoms" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:alert-circle" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
            {{ t('medicalRecords.symptoms') }}
          </h2>

          <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ record.symptoms }}</p>
          </div>
        </div>

        <!-- Treatment Card -->
        <div v-if="record.treatment" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:medical-bag" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {{ t('medicalRecords.treatment') }}
          </h2>

          <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ record.treatment }}</p>
          </div>
        </div>

        <!-- Prescriptions Card -->
        <div v-if="record.prescriptions" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:pill" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            {{ t('medicalRecords.prescriptions') }}
          </h2>

          <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ record.prescriptions }}</p>
          </div>
        </div>

        <!-- Procedures Card -->
        <div v-if="record.procedures" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:hospital-box" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {{ t('medicalRecords.procedures') }}
          </h2>

          <div class="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ record.procedures }}</p>
          </div>
        </div>

        <!-- Notes Card -->
        <div v-if="record.notes" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:note-text" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            {{ t('common.notes') }}
          </h2>

          <div class="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
            <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ record.notes }}</p>
          </div>
        </div>

        <!-- Vaccinations -->
        <div v-if="record.vaccinations && record.vaccinations.length > 0" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:needle" class="w-6 h-6 text-pink-600 dark:text-pink-400" />
            {{ t('medicalRecords.vaccinationsAdministered') }} ({{ record.vaccinations.length }})
          </h2>

          <div class="space-y-3">
            <div
              v-for="vaccination in record.vaccinations"
              :key="vaccination.id"
              class="p-4 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">{{ vaccination.vaccine_name }}</h3>
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span class="text-gray-500 dark:text-gray-400">{{ t('medicalRecords.administered') }}:</span>
                      <span class="text-gray-900 dark:text-white font-medium ml-2">{{ formatDate(vaccination.administered_date) }}</span>
                    </div>
                    <div v-if="vaccination.next_due_date">
                      <span class="text-gray-500 dark:text-gray-400">{{ t('medicalRecords.nextDue') }}:</span>
                      <span class="text-emerald-600 dark:text-emerald-400 font-medium ml-2">{{ formatDate(vaccination.next_due_date) }}</span>
                    </div>
                    <div v-if="vaccination.batch_number" class="col-span-2">
                      <span class="text-gray-500 dark:text-gray-400">{{ t('medicalRecords.batchNumber') }}:</span>
                      <span class="text-gray-900 dark:text-white font-mono font-medium ml-2">{{ vaccination.batch_number }}</span>
                    </div>
                  </div>
                  <p v-if="vaccination.notes" class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ vaccination.notes }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Appointment -->
        <div v-if="record.appointment" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:calendar-check" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {{ t('medicalRecords.relatedAppointment') }}
          </h2>

          <NuxtLink
            :to="`/appointments/${record.appointment.id}`"
            class="block p-4 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="mdi:calendar" class="w-4 h-4 text-gray-400" />
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ formatDate(record.appointment.appointment_date) }} {{ t('appointments.at') }} {{ record.appointment.appointment_time || formatTime(record.appointment.appointment_date) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ record.appointment.reason }}</p>
                <span
                  :class="{
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': record.appointment.status === 'confirmed',
                    'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400': record.appointment.status === 'scheduled',
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': record.appointment.status === 'completed',
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': record.appointment.status === 'in-progress',
                  }"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold capitalize">
                  {{ t(`appointments.${record.appointment.status}`) }}
                </span>
              </div>
              <Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="mdi:flash" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
            {{ t('appointments.quickActions') }}
          </h2>

          <div class="space-y-3">
            <NuxtLink
              v-if="record.pet"
              :to="`/pets/${record.pet.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:paw" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('medicalRecords.viewPetProfile') }}</span>
            </NuxtLink>

            <NuxtLink
              v-if="record.pet?.owner"
              :to="`/owners/${record.pet.owner.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:account" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('medicalRecords.viewOwnerProfile') }}</span>
            </NuxtLink>

            <NuxtLink
              v-if="record.pet"
              :to="`/appointments/create?pet_id=${record.pet.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:calendar-plus" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('medicalRecords.scheduleFollowUp') }}</span>
            </NuxtLink>

            <NuxtLink
              v-if="record.pet"
              :to="`/medical-records/create?pet_id=${record.pet.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:clipboard-plus" class="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('medicalRecords.addNewRecord') }}</span>
            </NuxtLink>

            <button
              @click="printRecord"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:printer" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('medicalRecords.printRecord') }}</span>
            </button>
          </div>
        </div>

        <!-- Medical Summary -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:chart-box" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {{ t('medicalRecords.summary') }}
          </h2>

          <div class="space-y-4">
            <div class="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
              <p class="text-sm text-teal-600 dark:text-teal-400 mb-1">{{ t('medicalRecords.recordType') }}</p>
              <p class="text-lg font-bold text-teal-900 dark:text-teal-100 capitalize">
                {{ record.appointment_id ? t('medicalRecords.appointmentRecord') : t('medicalRecords.generalRecord') }}
              </p>
            </div>

            <div v-if="record.weight && record.pet?.weight" class="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <p class="text-sm text-purple-600 dark:text-purple-400 mb-1">{{ t('medicalRecords.weightChange') }}</p>
              <p class="text-lg font-bold text-purple-900 dark:text-purple-100">
                {{ (record.weight - record.pet.weight).toFixed(1) }} kg
                <span class="text-sm font-normal">
                  ({{ record.pet.weight }} → {{ record.weight }} kg)
                </span>
              </p>
            </div>

            <div v-if="record.vaccinations && record.vaccinations.length > 0" class="p-4 rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800">
              <p class="text-sm text-pink-600 dark:text-pink-400 mb-1">{{ t('medicalRecords.vaccinations') }}</p>
              <p class="text-lg font-bold text-pink-900 dark:text-pink-100">{{ record.vaccinations.length }}</p>
            </div>
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
              <Icon name="mdi:clipboard-plus" class="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('medicalRecords.recordCreated') }}</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDateTime(record.created_at) }}</p>
              </div>
            </div>
            <div v-if="record.updated_at !== record.created_at" class="flex items-start gap-3">
              <Icon name="mdi:update" class="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('appointments.lastUpdated') }}</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDateTime(record.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-16 text-center border border-gray-100 dark:border-zinc-800">
      <Icon name="mdi:alert-circle" class="w-24 h-24 mx-auto text-red-300 dark:text-red-600 mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('medicalRecords.recordNotFound') }}</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('medicalRecords.recordNotFoundDesc') }}</p>
      <NuxtLink
        to="/medical-records"
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
        <Icon name="mdi:arrow-left" class="w-5 h-5" />
        {{ t('medicalRecords.backToRecords') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MedicalRecord } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()

const loading = ref(true)
const record = ref<MedicalRecord | null>(null)

const fetchRecord = async () => {
  loading.value = true
  try {
    const response = await $apiService.medicalRecords.getById(Number(route.params.id))
    record.value = response
  } catch (error) {
    console.error('Error fetching medical record:', handleError(error))
  } finally {
    loading.value = false
  }
}

const printRecord = () => {
  window.print()
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
  fetchRecord()
})
</script>
