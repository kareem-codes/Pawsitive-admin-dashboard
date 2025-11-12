<template>
  <Modal
    v-model="isOpen"
    :title="isEditing ? t('pets.editPet') : t('pets.createPet')"
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
            {{ t('pets.name') }} *
          </label>
          <input
            v-model="form.name"
            type="text"
            :placeholder="t('pets.namePlaceholder')"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
            :class="{ 'border-red-500': errors.name }" />
          <p v-if="errors.name" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('pets.dateOfBirth') }}
          </label>
          <input
            v-model="form.birth_date"
            type="date"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('pets.species') }} *
          </label>
          <select
            v-model="form.species"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"
            :class="{ 'border-red-500': errors.species }">
            <option value="">{{ t('pets.selectSpecies') }}</option>
            <option value="dog">{{ t('pets.dog') }}</option>
            <option value="cat">{{ t('pets.cat') }}</option>
            <option value="bird">{{ t('pets.bird') }}</option>
            <option value="rabbit">{{ t('pets.rabbit') }}</option>
            <option value="hamster">{{ t('pets.hamster') }}</option>
            <option value="other">{{ t('pets.other') }}</option>
          </select>
          <p v-if="errors.species" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.species }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('pets.breed') }}
          </label>
          <input
            v-model="form.breed"
            type="text"
            :placeholder="t('pets.breedPlaceholder')"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white" />
        </div>


      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('pets.gender') }}
          </label>
          <select
            v-model="form.gender"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white">
            <option value="">{{ t('pets.selectGender') }}</option>
            <option value="male">{{ t('pets.male') }}</option>
            <option value="female">{{ t('pets.female') }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('pets.color') }}
          </label>
          <input
            v-model="form.color"
            type="text"
            :placeholder="t('pets.colorPlaceholder')"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('pets.weight') }} (kg)
        </label>
        <input
          v-model.number="form.weight"
          type="number"
          step="0.1"
          :placeholder="t('pets.weightPlaceholder')"
          class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('pets.medicalNotes') }}
        </label>
        <textarea
          v-model="form.medical_notes"
          rows="3"
          :placeholder="t('pets.medicalNotesPlaceholder')"
          class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white"></textarea>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import type { Pet } from '~/types'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  petId: {
    type: [Number, String, null] as PropType<number | string | null>,
    default: null
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
  name: '',
  species: '',
  breed: '',
  birth_date: '',
  gender: '',
  color: '',
  weight: null as number | null,
  medical_notes: ''
})

const isEditing = computed(() => !!props.petId)

// Watch for modal open/close to load data or reset form
watch(isOpen, async (newValue) => {
  if (newValue) {
    if (props.petId) {
      await loadPet()
    } else {
      resetForm()
    }
  } else {
    error.value = null
    errors.value = {}
  }
})

const loadPet = async () => {
  if (!props.petId) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await $apiService.pets.getById(Number(props.petId))
    const pet: any = response
    
    form.value = {
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      birth_date: pet.birth_date || '',
      gender: pet.gender || '',
      color: pet.color || '',
      weight: pet.weight || null,
      medical_notes: pet.medical_notes || ''
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load pet data'
    emit('error', err)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    species: '',
    breed: '',
    birth_date: '',
    gender: '',
    color: '',
    weight: null,
    medical_notes: ''
  }
  errors.value = {}
}

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.name?.trim()) {
    errors.value.name = 'Pet name is required'
  }
  
  if (!form.value.species?.trim()) {
    errors.value.species = 'Species is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSave = async () => {
  if (!validateForm()) {
    return
  }
  
  if (!props.ownerId && !isEditing.value) {
    error.value = 'Owner ID is required to create a pet'
    return
  }
  
  saving.value = true
  error.value = null
  
  try {
    const data: any = {
      name: form.value.name,
      species: form.value.species,
      breed: form.value.breed || undefined,
      birth_date: form.value.birth_date || undefined,
      gender: form.value.gender || undefined,
      color: form.value.color || undefined,
      weight: form.value.weight || undefined,
      medical_notes: form.value.medical_notes || undefined
    }
    
    // Add user_id (owner_id) only for new pets
    if (!isEditing.value) {
      data.user_id = Number(props.ownerId)
    }
    
    let savedPet
    if (isEditing.value) {
      const response = await $apiService.pets.update(Number(props.petId), data)
      savedPet = response.data
      toast.success(t('pets.updateSuccess') || 'Pet updated successfully')
    } else {
      const response = await $apiService.pets.create(data)
      savedPet = response.data
      toast.success(t('pets.createSuccess') || 'Pet created successfully')
    }
    
    emit('saved', savedPet)
    isOpen.value = false
    resetForm()
  } catch (err: any) {
    console.error('Error saving pet:', err)
    error.value = err.response?.data?.message || 'Failed to save pet'
    
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
