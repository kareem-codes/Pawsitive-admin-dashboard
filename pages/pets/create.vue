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
            {{ isEdit ? t('pets.editPet') : t('pets.newPet') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('pets.createSubtitle') }}</p>
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
      <!-- Basic Information -->
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">{{ t('pets.basicInfo') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Pet Photo -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              {{ t('pets.photo') }}
            </label>
            <div class="flex items-center gap-6">
              <div class="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-zinc-700">
                <img v-if="photoPreview" :src="photoPreview" alt="Preview" class="h-full w-full object-cover" />
                <Icon v-else name="mdi:paw" class="w-16 h-16 text-indigo-300 dark:text-indigo-700" />
              </div>
              <div>
                <label class="cursor-pointer inline-flex items-center px-4 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-600 transition-colors">
                  <Icon name="mdi:upload" class="w-4 h-4 me-2" />
                  {{ t('common.uploadImage') }}
                  <input
                    type="file"
                    accept="image/*"
                    @change="handlePhotoChange"
                    class="hidden"
                  />
                </label>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  JPG, PNG or GIF (MAX. 5MB)
                </p>
              </div>
            </div>
          </div>
          
          <!-- Pet Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('pets.name') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              :placeholder="t('pets.namePlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Owner -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('pets.owner') }} <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.user_id"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
              <option value="">{{ t('pets.selectOwner') }}</option>
              <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                {{ owner.name }}
              </option>
            </select>
          </div>

          <!-- Species -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('pets.species') }} <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.species"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
              <option value="">{{ t('pets.selectSpecies') }}</option>
              <option value="dog">{{ t('pets.dog') }}</option>
              <option value="cat">{{ t('pets.cat') }}</option>
              <option value="bird">{{ t('pets.bird') }}</option>
              <option value="rabbit">{{ t('pets.rabbit') }}</option>
              <option value="hamster">{{ t('pets.hamster') }}</option>
              <option value="other">{{ t('pets.other') }}</option>
            </select>
          </div>

          <!-- Breed -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('pets.breed') }}
            </label>
            <input
              v-model="form.breed"
              type="text"
              :placeholder="t('pets.breedPlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Date of Birth -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('pets.dateOfBirth') }}
            </label>
            <input
              v-model="form.birth_date"
              type="date"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Gender -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('pets.gender') }}
            </label>
            <select
              v-model="form.gender"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all">
              <option value="">{{ t('pets.selectGender') }}</option>
              <option value="male">{{ t('pets.male') }}</option>
              <option value="female">{{ t('pets.female') }}</option>
            </select>
          </div>

          <!-- Color -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('pets.color') }}
            </label>
            <input
              v-model="form.color"
              type="text"
              :placeholder="t('pets.colorPlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Weight -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('pets.weight') }} (kg)
            </label>
            <input
              v-model.number="form.weight"
              type="number"
              step="0.1"
              :placeholder="t('pets.weightPlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all" />
          </div>

          <!-- Medical Notes -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('pets.medicalNotes') }}
            </label>
            <textarea
              v-model="form.medical_notes"
              rows="3"
              :placeholder="t('pets.medicalNotesPlaceholder')"
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
  </div>
</template>

<script setup lang="ts">
import { log } from 'console'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { $apiService } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.query.id)
const petId = computed(() => route.query.id ? Number(route.query.id) : null)

const saving = ref(false)
const error = ref<string | null>(null)
const owners = ref<any[]>([])
const photoFile = ref<File | null>(null)
const photoPreview = ref<string>('')

const form = ref({
  name: '',
  user_id: '',
  species: '',
  breed: '',
  birth_date: '',
  gender: '',
  color: '',
  weight: null as number | null,
  medical_notes: ''
})

onMounted(async () => {
  await loadOwners()
  if (isEdit.value && petId.value) {
    await loadPet()
  }
})

const loadOwners = async () => {
  try {
    const response = await $apiService.owners.getAll({ per_page: 1000 })
    owners.value = response.data
  } catch (err: any) {
    console.error('Error loading owners:', err)
    error.value = t('pets.errorLoadingOwners')
  }
}

const loadPet = async () => {
  try {
    const response = await $apiService.pets.getById(petId.value!)
    const pet: any = response
    console.log(response);
    
    form.value = {
      name: pet.name || '',
      user_id: pet.user_id?.toString() || '',
      species: pet.species || '',
      breed: pet.breed || '',
      birth_date: pet.birth_date || '',
      gender: pet.gender || '',
      color: pet.color || '',
      weight: pet.weight || null,
      medical_notes: pet.medical_notes || ''
    }
    
    if (pet.photo_url) {
      photoPreview.value = pet.photo_url
    }
  } catch (err: any) {
    console.error('Error loading pet:', err)
    error.value = t('pets.errorLoadingPet')
  }
}

const handlePhotoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'File size must be less than 5MB'
      return
    }
    
    photoFile.value = file
    const reader = new FileReader()
    reader.onloadend = () => {
      photoPreview.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = null

  try {
    const formData = new FormData()
    
    formData.append('name', form.value.name)
    formData.append('user_id', form.value.user_id)
    formData.append('species', form.value.species)
    if (form.value.breed) formData.append('breed', form.value.breed)
    if (form.value.birth_date) formData.append('birth_date', form.value.birth_date)
    if (form.value.gender) formData.append('gender', form.value.gender)
    if (form.value.color) formData.append('color', form.value.color)
    if (form.value.weight !== null) formData.append('weight', form.value.weight.toString())
    if (form.value.medical_notes) formData.append('notes', form.value.medical_notes)
    
    if (photoFile.value) {
      formData.append('photo', photoFile.value)
    }

    if (isEdit.value && petId.value) {
      await $apiService.pets.update(petId.value, formData)
    } else {
      await $apiService.pets.create(formData)
    }

    router.push('/pets')
  } catch (err: any) {
    error.value = err.response?.data?.message || t('pets.errorSaving')
    console.error('Error saving pet:', err)
  } finally {
    saving.value = false
  }
}
</script>
