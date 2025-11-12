<template>
  <div class="animate-fade-in">
    <!-- Breadcrumb -->
    <nav class="mb-4 flex items-center gap-2 text-sm">
      <NuxtLink to="/settings" class="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        {{ t('nav.settings') }}
      </NuxtLink>
      <Icon name="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
      <span class="text-gray-900 dark:text-white font-medium">{{ t('settings.myProfile') }}</span>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {{ t('settings.myProfile') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('settings.myProfileSubtitle') }}</p>
    </div>

    <!-- Error/Success Alerts -->
    <div v-if="error" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
      <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
    </div>
    <div v-if="success" class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
      <p class="text-sm text-green-700 dark:text-green-400">{{ success }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Profile Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 p-6">
          <div class="text-center">
            <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
              {{ profile?.name?.charAt(0).toUpperCase() }}
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ profile?.name }}</h2>
            <p class="text-gray-600 dark:text-gray-400 mt-1">{{ profile?.email }}</p>
            
            <!-- Roles -->
            <div v-if="profile?.roles?.length" class="mt-4 flex flex-wrap gap-2 justify-center">
              <span
                v-for="role in profile.roles"
                :key="role.id"
                class="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 capitalize">
                {{ role.name }}
              </span>
            </div>

            <!-- User Type -->
            <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">{{ t('settings.userType') }}:</span>
              <span class="ml-2 capitalize">{{ profile?.user_type || 'N/A' }}</span>
            </div>

            <!-- Status -->
            <div class="mt-2">
              <span
                :class="[
                  'inline-flex px-3 py-1 rounded-full text-xs font-medium',
                  profile?.is_active
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                ]">
                {{ profile?.is_active ? t('settings.active') : t('settings.inactive') }}
              </span>
            </div>
          </div>

          <!-- Permissions Summary -->
          <div v-if="profile?.permissions?.length" class="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {{ t('settings.permissions') }} ({{ profile.permissions.length }})
            </h3>
            <div class="max-h-48 overflow-y-auto space-y-1">
              <div
                v-for="permission in profile.permissions"
                :key="permission.id"
                class="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 px-3 py-2 rounded-lg">
                {{ permission.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Form -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800">
          <!-- Tabs -->
          <div class="border-b border-gray-200 dark:border-zinc-800">
            <nav class="flex space-x-8 rtl:space-x-reverse px-6" aria-label="Tabs">
              <button
                @click="activeTab = 'profile'"
                :class="[
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
                ]">
                <Icon name="mdi:account-edit" class="w-5 h-5" />
                {{ t('settings.editProfile') }}
              </button>
              <button
                @click="activeTab = 'password'"
                :class="[
                  activeTab === 'password'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
                ]">
                <Icon name="mdi:lock-reset" class="w-5 h-5" />
                {{ t('settings.changePassword') }}
              </button>
            </nav>
          </div>

          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('settings.name') }}
                </label>
                <input
                  v-model="profileForm.name"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('settings.email') }}
                </label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('settings.firstName') }}
                </label>
                <input
                  v-model="profileForm.first_name"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('settings.lastName') }}
                </label>
                <input
                  v-model="profileForm.last_name"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('settings.phone') }}
                </label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('settings.phoneSecondary') }}
                </label>
                <input
                  v-model="profileForm.phone_secondary"
                  type="tel"
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white" />
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                @click="resetForm"
                class="px-6 py-2.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                {{ t('common.cancel') }}
              </button>
              <button
                @click="updateProfile"
                :disabled="saving"
                class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
                {{ saving ? t('common.saving') : t('common.saveChanges') }}
              </button>
            </div>
          </div>

          <!-- Password Tab -->
          <div v-else-if="activeTab === 'password'" class="p-6 space-y-6">
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
              <div class="flex gap-3">
                <Icon name="mdi:information" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div class="text-sm text-blue-700 dark:text-blue-400">
                  <p class="font-medium">{{ t('settings.passwordRequirements') }}</p>
                  <ul class="mt-2 list-disc list-inside space-y-1">
                    <li>{{ t('settings.passwordMinLength') }}</li>
                    <li>{{ t('settings.passwordMustMatch') }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('settings.currentPassword') }}
                </label>
                <input
                  v-model="passwordForm.current_password"
                  type="password"
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('settings.newPassword') }}
                </label>
                <input
                  v-model="passwordForm.new_password"
                  type="password"
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('settings.confirmNewPassword') }}
                </label>
                <input
                  v-model="passwordForm.new_password_confirmation"
                  type="password"
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white" />
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                @click="resetPasswordForm"
                class="px-6 py-2.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                {{ t('common.cancel') }}
              </button>
              <button
                @click="updatePassword"
                :disabled="saving"
                class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
                {{ saving ? t('common.updating') : t('settings.updatePassword') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const { $api } = useNuxtApp()

const loading = ref(false)
const saving = ref(false)
const error = ref(null)
const success = ref(null)

const profile = ref(null)
const activeTab = ref('profile')

const profileForm = ref({
  name: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  phone_secondary: ''
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const fetchProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $api.get('/profile')
    profile.value = response.data
    
    // Populate form
    profileForm.value = {
      name: response.data.name || '',
      first_name: response.data.first_name || '',
      last_name: response.data.last_name || '',
      email: response.data.email || '',
      phone: response.data.phone || '',
      phone_secondary: response.data.phone_secondary || ''
    }
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  saving.value = true
  error.value = null
  success.value = null
  
  try {
    const response = await $api.put('/profile', profileForm.value)
    profile.value = response.data.user
    success.value = t('settings.profileUpdatedSuccess')
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  } finally {
    saving.value = false
  }
}

const updatePassword = async () => {
  if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
    error.value = t('settings.passwordsDoNotMatch')
    return
  }
  
  saving.value = true
  error.value = null
  success.value = null
  
  try {
    await $api.put('/profile', passwordForm.value)
    success.value = t('settings.passwordUpdatedSuccess')
    resetPasswordForm()
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  if (profile.value) {
    profileForm.value = {
      name: profile.value.name || '',
      first_name: profile.value.first_name || '',
      last_name: profile.value.last_name || '',
      email: profile.value.email || '',
      phone: profile.value.phone || '',
      phone_secondary: profile.value.phone_secondary || ''
    }
  }
  error.value = null
  success.value = null
}

const resetPasswordForm = () => {
  passwordForm.value = {
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  }
  error.value = null
  success.value = null
}

onMounted(() => {
  fetchProfile()
})
</script>
