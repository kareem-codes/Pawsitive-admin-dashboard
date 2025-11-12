<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {{ t('nav.settings') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('settings.subtitle') }}</p>
    </div>

    <!-- Quick Links -->
    <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink
        to="/settings/profile"
        class="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800 p-6 hover:shadow-xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <Icon name="mdi:account-edit" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('settings.myProfile') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('settings.editYourProfile') }}</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        v-if="hasPermission('view users')"
        to="/settings/users"
        class="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800 p-6 hover:shadow-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all group">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <Icon name="mdi:account-group" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('settings.userManagement') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('settings.manageUsers') }}</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        v-if="hasPermission('view roles')"
        to="/settings/roles"
        class="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800 p-6 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all group">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <Icon name="mdi:shield-account" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('settings.rolesPermissions') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('settings.manageRoles') }}</p>
          </div>
        </div>
      </NuxtLink>

      <div
        v-if="hasPermission('edit settings')"
        class="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800 p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <Icon name="mdi:cog" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('settings.generalSettings') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('settings.configureApp') }}</p>
          </div>
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

    <!-- Success Alert -->
    <div v-if="success" class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
      <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
      <div class="flex-1">
        <h3 class="text-sm font-semibold text-green-800 dark:text-green-300">{{ t('common.success') }}</h3>
        <p class="text-sm text-green-700 dark:text-green-400 mt-1">{{ success }}</p>
      </div>
      <button @click="success = null" class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
        <Icon name="mdi:close" class="w-5 h-5" />
      </button>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800">
      <div class="border-b border-gray-200 dark:border-zinc-800">
        <nav class="flex space-x-8 rtl:space-x-reverse px-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.name"
            :class="[
              activeTab === tab.name
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
            ]">
            <Icon :name="tab.icon" class="w-5 h-5" />
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <!-- General Settings -->
        <div v-else-if="activeTab === 'general'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('settings.generalSettings') }}</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.appName') }}
              </label>
              <input
                v-model="generalSettings.app_name"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.timezone') }}
              </label>
              <select
                v-model="generalSettings.timezone"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
                <option value="Africa/Cairo">Africa/Cairo</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New York</option>
                <option value="America/Los_Angeles">America/Los Angeles</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.dateFormat') }}
              </label>
              <select
                v-model="generalSettings.date_format"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
                <option value="Y-m-d">YYYY-MM-DD</option>
                <option value="m/d/Y">MM/DD/YYYY</option>
                <option value="d/m/Y">DD/MM/YYYY</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.currency') }}
              </label>
              <select
                v-model="generalSettings.currency"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
                <option value="EGP">EGP (ج.م)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              @click="saveGeneralSettings"
              :disabled="saving"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon name="mdi:content-save" class="w-5 h-5" />
              {{ saving ? t('common.saving') : t('common.save') }}
            </button>
          </div>
        </div>

        <!-- Clinic Settings -->
        <div v-else-if="activeTab === 'clinic'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('settings.clinicInformation') }}</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.clinicName') }}
              </label>
              <input
                v-model="clinicSettings.clinic_name"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.clinicAddress') }}
              </label>
              <textarea
                v-model="clinicSettings.clinic_address"
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.clinicPhone') }}
              </label>
              <input
                v-model="clinicSettings.clinic_phone"
                type="tel"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.clinicEmail') }}
              </label>
              <input
                v-model="clinicSettings.clinic_email"
                type="email"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.workingHours') }}
              </label>
              <input
                v-model="clinicSettings.working_hours"
                type="text"
                placeholder="9:00 AM - 5:00 PM"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.licenseNumber') }}
              </label>
              <input
                v-model="clinicSettings.license_number"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              @click="saveClinicSettings"
              :disabled="saving"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon name="mdi:content-save" class="w-5 h-5" />
              {{ saving ? t('common.saving') : t('common.save') }}
            </button>
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-else-if="activeTab === 'notifications'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('settings.notificationSettings') }}</h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ t('settings.appointmentReminders') }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('settings.appointmentRemindersDesc') }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationSettings.appointment_reminders"
                  type="checkbox"
                  class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ t('settings.vaccinationReminders') }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('settings.vaccinationRemindersDesc') }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationSettings.vaccination_reminders"
                  type="checkbox"
                  class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ t('settings.invoiceNotifications') }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('settings.invoiceNotificationsDesc') }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationSettings.invoice_notifications"
                  type="checkbox"
                  class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ t('settings.emailNotifications') }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('settings.emailNotificationsDesc') }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationSettings.email_notifications"
                  type="checkbox"
                  class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ t('settings.smsNotifications') }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('settings.smsNotificationsDesc') }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationSettings.sms_notifications"
                  type="checkbox"
                  class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              @click="saveNotificationSettings"
              :disabled="saving"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon name="mdi:content-save" class="w-5 h-5" />
              {{ saving ? t('common.saving') : t('common.save') }}
            </button>
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
const { hasPermission } = usePermissions()

const activeTab = ref('general')
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const tabs = [
  { name: 'general', label: t('settings.general'), icon: 'mdi:cog' },
  { name: 'clinic', label: t('settings.clinic'), icon: 'mdi:hospital-building' },
  { name: 'notifications', label: t('settings.notifications'), icon: 'mdi:bell' },
]

// Settings data
const generalSettings = ref({
  app_name: '',
  timezone: 'UTC',
  date_format: 'Y-m-d',
  currency: 'USD',
})

const clinicSettings = ref({
  clinic_name: '',
  clinic_address: '',
  clinic_phone: '',
  clinic_email: '',
  working_hours: '',
  license_number: '',
})

const notificationSettings = ref({
  appointment_reminders: true,
  vaccination_reminders: true,
  invoice_notifications: true,
  email_notifications: true,
  sms_notifications: false,
})

// Fetch settings on mount
onMounted(() => {
  fetchSettings()
})

const fetchSettings = async () => {
  loading.value = true
  error.value = null
  
  try {
    const allSettings = await $apiService.settings.getAll()
    
    // Map general settings
    generalSettings.value = {
      app_name: allSettings.app_name || 'Pawsitive Systems',
      timezone: allSettings.timezone || 'UTC',
      date_format: allSettings.date_format || 'Y-m-d',
      currency: allSettings.currency || 'USD',
    }
    
    // Map clinic settings
    clinicSettings.value = {
      clinic_name: allSettings.clinic_name || '',
      clinic_address: allSettings.clinic_address || '',
      clinic_phone: allSettings.clinic_phone || '',
      clinic_email: allSettings.clinic_email || '',
      working_hours: allSettings.working_hours || '',
      license_number: allSettings.license_number || '',
    }
    
    // Map notification settings
    notificationSettings.value = {
      appointment_reminders: allSettings.appointment_reminders ?? true,
      vaccination_reminders: allSettings.vaccination_reminders ?? true,
      invoice_notifications: allSettings.invoice_notifications ?? true,
      email_notifications: allSettings.email_notifications ?? true,
      sms_notifications: allSettings.sms_notifications ?? false,
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load settings'
    console.error('Error fetching settings:', err)
  } finally {
    loading.value = false
  }
}

const saveGeneralSettings = async () => {
  saving.value = true
  error.value = null
  success.value = null
  
  try {
    await $apiService.settings.updateBatch([
      { key: 'app_name', value: generalSettings.value.app_name, type: 'string' },
      { key: 'timezone', value: generalSettings.value.timezone, type: 'string' },
      { key: 'date_format', value: generalSettings.value.date_format, type: 'string' },
      { key: 'currency', value: generalSettings.value.currency, type: 'string' },
    ])
    
    success.value = t('settings.settingsSaved')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save settings'
    console.error('Error saving general settings:', err)
  } finally {
    saving.value = false
  }
}

const saveClinicSettings = async () => {
  saving.value = true
  error.value = null
  success.value = null
  
  try {
    await $apiService.settings.updateBatch([
      { key: 'clinic_name', value: clinicSettings.value.clinic_name, type: 'string' },
      { key: 'clinic_address', value: clinicSettings.value.clinic_address, type: 'string' },
      { key: 'clinic_phone', value: clinicSettings.value.clinic_phone, type: 'string' },
      { key: 'clinic_email', value: clinicSettings.value.clinic_email, type: 'string' },
      { key: 'working_hours', value: clinicSettings.value.working_hours, type: 'string' },
      { key: 'license_number', value: clinicSettings.value.license_number, type: 'string' },
    ])
    
    success.value = t('settings.settingsSaved')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save settings'
    console.error('Error saving clinic settings:', err)
  } finally {
    saving.value = false
  }
}

const saveNotificationSettings = async () => {
  saving.value = true
  error.value = null
  success.value = null
  
  try {
    await $apiService.settings.updateBatch([
      { key: 'appointment_reminders', value: notificationSettings.value.appointment_reminders, type: 'boolean' },
      { key: 'vaccination_reminders', value: notificationSettings.value.vaccination_reminders, type: 'boolean' },
      { key: 'invoice_notifications', value: notificationSettings.value.invoice_notifications, type: 'boolean' },
      { key: 'email_notifications', value: notificationSettings.value.email_notifications, type: 'boolean' },
      { key: 'sms_notifications', value: notificationSettings.value.sms_notifications, type: 'boolean' },
    ])
    
    success.value = t('settings.settingsSaved')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save settings'
    console.error('Error saving notification settings:', err)
  } finally {
    saving.value = false
  }
}
</script>
