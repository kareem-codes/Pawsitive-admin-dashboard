<template>
  <Modal
    v-model="isOpen"
    :title="isEditing ? t('settings.editUser') : t('settings.createUser')"
    size="2xl"
    :cancel-text="t('common.cancel')"
    :confirm-text="saving ? t('common.saving') : t('common.save')"
    :loading="saving"
    :loading-text="t('common.saving')"
    @confirm="handleSave"
    @close="handleClose">
    <!-- Error Alert -->
    <div v-if="error" class="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
      <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
    </div>

    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('settings.name') }} *
          </label>
          <input
            v-model="form.name"
            type="text"
            :placeholder="t('settings.namePlaceholder') || 'Enter full name'"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
            :class="{ 'border-red-500': errors.name }" />
          <p v-if="errors.name" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.name }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('settings.email') }} *
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="user@example.com"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
            :class="{ 'border-red-500': errors.email }" />
          <p v-if="errors.email" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.email }}</p>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('settings.phone') }}
        </label>
        <input
          v-model="form.phone"
          type="tel"
          :placeholder="t('settings.phonePlaceholder') || '+1 (555) 000-0000'"
          class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white" />
      </div>

      <div v-if="!isEditing" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('settings.password') }} *
          </label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
            :class="{ 'border-red-500': errors.password }" />
          <p v-if="errors.password" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.password }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('settings.confirmPassword') || 'Confirm Password' }}
          </label>
          <input
            v-model="form.password_confirmation"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
            :class="{ 'border-red-500': errors.password_confirmation }" />
          <p v-if="errors.password_confirmation" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.password_confirmation }}</p>
        </div>
      </div>

      <div v-if="showRoleSelection && roles.length > 0">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('settings.role') }}
        </label>
        <select
          v-model="form.role"
          class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white">
          <option value="">{{ t('settings.selectRole') }}</option>
          <option v-for="role in roles" :key="role.id" :value="role.name">
            {{ role.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="form.is_active"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('settings.activeUser') }}</span>
        </label>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  userId: {
    type: [Number, String, null] as PropType<number | string | null>,
    default: null
  },
  showRoleSelection: {
    type: Boolean,
    default: true
  },
  autoFetchRoles: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'saved', 'error', 'close'])

const { t } = useI18n()
const { $api } = useNuxtApp()
const toast = useToast()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const saving = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const errors = ref<Record<string, string>>({})
const roles = ref<any[]>([])

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  role: '',
  is_active: true
})

const isEditing = computed(() => !!props.userId)

// Fetch roles if needed
const fetchRoles = async () => {
  if (!props.autoFetchRoles || !props.showRoleSelection) return
  
  try {
    const response = await $api.get('/roles')
    roles.value = response.data?.data || response.data || []
  } catch (err) {
    console.error('Failed to fetch roles:', err)
  }
}

// Fetch user data if editing
const fetchUser = async () => {
  if (!props.userId) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await $api.get(`/users/${props.userId}`)
    const user = response.data?.data || response.data
    
    form.value = {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      password_confirmation: '',
      role: user.roles?.[0]?.name || '',
      is_active: user.is_active ?? true
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || t('settings.errorLoadingUser') || 'Failed to load user'
    emit('error', err)
  } finally {
    loading.value = false
  }
}

// Validate form
const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.name?.trim()) {
    errors.value.name = t('settings.nameRequired') || 'Name is required'
  }
  
  if (!form.value.email?.trim()) {
    errors.value.email = t('settings.emailRequired') || 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = t('settings.emailInvalid') || 'Invalid email format'
  }
  
  if (!isEditing.value) {
    if (!form.value.password) {
      errors.value.password = t('settings.passwordRequired') || 'Password is required'
    } else if (form.value.password.length < 8) {
      errors.value.password = t('settings.passwordMinLength') || 'Password must be at least 8 characters'
    }
    
    if (form.value.password !== form.value.password_confirmation) {
      errors.value.password_confirmation = t('settings.passwordMismatch') || 'Passwords do not match'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

// Save user
const handleSave = async () => {
  if (!validateForm()) return
  
  saving.value = true
  error.value = null
  
  try {
    const payload: any = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone || null,
      is_active: form.value.is_active
    }
    
    if (props.showRoleSelection && form.value.role) {
      payload.role = form.value.role
    }
    
    if (!isEditing.value) {
      payload.password = form.value.password
      payload.password_confirmation = form.value.password_confirmation
    }
    
    let response
    if (isEditing.value) {
      response = await $api.put(`/users/${props.userId}`, payload)
    } else {
      response = await $api.post('/users', payload)
    }
    
    const savedUser = response.data?.data || response.data
    emit('saved', savedUser)
    handleClose()
  } catch (err: any) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    }
    error.value = err.response?.data?.message || t('common.errorOccurred') || 'An error occurred'
    emit('error', err)
  } finally {
    saving.value = false
  }
}

// Close modal
const handleClose = () => {
  resetForm()
  emit('close')
  emit('update:modelValue', false)
}

// Reset form
const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: '',
    is_active: true
  }
  error.value = null
  errors.value = {}
}

// Watch for modal open/close
watch(() => props.modelValue, async (newValue) => {
  if (newValue) {
    if (props.userId) {
      await fetchUser()
    }
    if (props.showRoleSelection) {
      await fetchRoles()
    }
  } else {
    resetForm()
  }
})

// Expose methods for parent component
defineExpose({
  resetForm,
  fetchUser,
  fetchRoles
})
</script>
