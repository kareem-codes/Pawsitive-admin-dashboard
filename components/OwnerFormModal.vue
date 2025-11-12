<template>
    <Modal
        v-model="isOpen"
        :title="isEditing ? t('owners.editOwner') : t('owners.createOwner')"
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
                        {{ t('owners.firstName') }} *
                    </label>
                    <input
                        v-model="form.first_name"
                        type="text"
                        placeholder="Enter first name"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
                        :class="{ 'border-red-500': errors.first_name }" />
                    <p v-if="errors.first_name" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.first_name }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('owners.lastName') }} *
                    </label>
                    <input
                        v-model="form.last_name"
                        type="text"
                        placeholder="Enter last name"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
                        :class="{ 'border-red-500': errors.last_name }" />
                    <p v-if="errors.last_name" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.last_name }}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('owners.email') }} *
                    </label>
                    <input
                        v-model="form.email"
                        type="email"
                        placeholder="owner@example.com"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
                        :class="{ 'border-red-500': errors.email }" />
                    <p v-if="errors.email" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.email }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('owners.phone') }} *
                    </label>
                    <input
                        v-model="form.phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
                        :class="{ 'border-red-500': errors.phone }" />
                    <p v-if="errors.phone" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.phone }}</p>
                </div>
            </div>

            <div v-if="!isEditing" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('owners.password') }} *
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
                        {{ t('owners.confirmPassword') }}
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

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('owners.address') }}
                </label>
                <input
                    v-model="form.address"
                    type="text"
                    placeholder="Enter address"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('owners.emergencyContact') }}
                    </label>
                    <input
                        v-model="form.emergency_contact"
                        type="text"
                        placeholder="Emergency contact name"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('owners.emergencyPhone') }}
                    </label>
                    <input
                        v-model="form.emergency_phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white" />
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('owners.notes') }}
                </label>
                <textarea
                    v-model="form.notes"
                    rows="3"
                    placeholder="Additional notes about the owner"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"></textarea>
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import type { Owner } from '~/types'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    ownerId: {
        type: [Number, String, null] as PropType<number | string | null>,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'saved', 'error', 'close'])

const { t } = useI18n()
const { $apiService } = useNuxtApp()
const toast = useToast()

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const saving = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const errors = ref<Record<string, string>>({})

const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    notes: ''
})

const isEditing = computed(() => !!props.ownerId)

// Watch for modal open/close to load data or reset form
watch(isOpen, async (newValue) => {
    if (newValue) {
        if (props.ownerId) {
            await loadOwner()
        } else {
            resetForm()
        }
    } else {
        error.value = null
        errors.value = {}
    }
})

const loadOwner = async () => {
    if (!props.ownerId) return

    loading.value = true
    error.value = null

    try {
        const response = await $apiService.owners.getById(Number(props.ownerId))
        const owner = response.data

        // Split name into first and last name if needed
        const nameParts = owner.name?.split(' ') || []
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        form.value = {
            first_name: firstName,
            last_name: lastName,
            email: owner.email || '',
            phone: owner.phone || '',
            password: '',
            password_confirmation: '',
            address: owner.address || '',
            emergency_contact: owner.emergency_contact || '',
            emergency_phone: owner.emergency_phone || '',
            notes: owner.notes || ''
        }
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to load owner data'
        emit('error', err)
    } finally {
        loading.value = false
    }
}

const resetForm = () => {
    form.value = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        address: '',
        emergency_contact: '',
        emergency_phone: '',
        notes: ''
    }
    errors.value = {}
}

const validateForm = (): boolean => {
    errors.value = {}

    if (!form.value.first_name?.trim()) {
        errors.value.first_name = 'First name is required'
    }

    if (!form.value.last_name?.trim()) {
        errors.value.last_name = 'Last name is required'
    }

    if (!form.value.email?.trim()) {
        errors.value.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Invalid email format'
    }

    if (!form.value.phone?.trim()) {
        errors.value.phone = 'Phone is required'
    }

    if (!isEditing.value) {
        if (!form.value.password?.trim()) {
            errors.value.password = 'Password is required'
        } else if (form.value.password.length < 8) {
            errors.value.password = 'Password must be at least 8 characters'
        }

        if (form.value.password !== form.value.password_confirmation) {
            errors.value.password_confirmation = 'Passwords do not match'
        }
    }

    return Object.keys(errors.value).length === 0
}

const handleSave = async () => {
    if (!validateForm()) {
        return
    }

    saving.value = true
    error.value = null

    try {
        const data: any = {
            name: `${form.value.first_name} ${form.value.last_name}`.trim(),
            last_name: `${form.value.last_name}`.trim(),
            first_name: `${form.value.first_name}`.trim(),
            email: form.value.email,
            phone: form.value.phone,
            address: form.value.address || undefined,
            emergency_contact: form.value.emergency_contact || undefined,
            emergency_phone: form.value.emergency_phone || undefined,
            notes: form.value.notes || undefined
        }

        // Add password only for new owners
        if (!isEditing.value && form.value.password) {
            data.password = form.value.password
            data.password_confirmation = form.value.password_confirmation
        }

        let savedOwner
        if (isEditing.value) {
            const response = await $apiService.owners.update(Number(props.ownerId), data)
            savedOwner = response.data
            toast.success(t('owners.updateSuccess') || 'Owner updated successfully')
        } else {
            const response = await $apiService.owners.create(data)
            savedOwner = response.data
            toast.success(t('owners.createSuccess') || 'Owner created successfully')
        }

        emit('saved', savedOwner)
        isOpen.value = false
        resetForm()
    } catch (err: any) {
        console.error('Error saving owner:', err)
        error.value = err.response?.data?.message || 'Failed to save owner'

        if (err.response?.data?.errors) {
            errors.value = err.response.data.errors
        }

        emit('error', err)
    } finally {
        saving.value = false
    }
}

const handleClose = () => {
    isOpen.value = false
    emit('close')
}
</script>
