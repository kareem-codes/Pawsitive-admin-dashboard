<template>
    <div class="animate-fade-in">
        <!-- Header -->
        <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {{ t('nav.pets') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('pets.subtitle') }}</p>
            </div>
            <NuxtLink
                to="/pets/create"
                class="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold">
                <Icon name="mdi:plus-circle" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                {{ t('pets.new') }}
            </NuxtLink>
        </div>

        <!-- Filters -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 dark:border-zinc-800">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('common.search') }}
                    </label>
                    <div class="relative">
                        <Icon name="mdi:magnify" class="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            v-model="filters.search"
                            type="text"
                            :placeholder="t('pets.searchPlaceholder')"
                            class="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
                            @input="debouncedSearch" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('pets.species') }}
                    </label>
                    <select
                        v-model="filters.species"
                        style="appearance: listbox;"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
                        @change="() => fetchPets()">
                        <option value="">{{ t('common.all') }}</option>
                        <option value="dog">{{ t('pets.dog') }}</option>
                        <option value="cat">{{ t('pets.cat') }}</option>
                        <option value="bird">{{ t('pets.bird') }}</option>
                        <option value="rabbit">{{ t('pets.rabbit') }}</option>
                        <option value="other">{{ t('pets.other') }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('common.status') }}
                    </label>
                    <select
                        v-model="filters.status"
                        style="appearance: listbox;"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-zinc-800 dark:text-white transition-all"
                        @change="() => fetchPets()">
                        <option value="">{{ t('common.all') }}</option>
                        <option value="active">{{ t('pets.status.active') }}</option>
                        <option value="inactive">{{ t('pets.status.inactive') }}</option>
                        <option value="deceased">{{ t('pets.status.deceased') }}</option>
                    </select>
                </div>
                <div class="flex items-end">
                    <button
                        @click="clearFilters"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 font-medium transition-all flex items-center justify-start gap-2">
                        <Icon name="mdi:filter-off" class="w-5 h-5" />
                        {{ t('common.clearFilters') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-16">
            <Icon name="mdi:loading" class="w-12 h-12 animate-spin mx-auto text-purple-600 dark:text-purple-400" />
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">{{ t('common.loading') }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="pets.length === 0" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-16 text-center border border-gray-100 dark:border-zinc-800">
            <Icon name="mdi:paw-off" class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('pets.noPets') }}</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('pets.noPetsDesc') }}</p>
            <NuxtLink
                to="/pets/create"
                class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg">
                <Icon name="mdi:plus-circle" class="w-5 h-5" />
                {{ t('pets.new') }}
            </NuxtLink>
        </div>

        <!-- Pets Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
                v-for="pet in pets"
                :key="pet.id"
                class="group bg-white dark:bg-zinc-900 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                @click="viewPet(pet.id)">
                <!-- Pet Image -->
                <div class="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 overflow-hidden">
                    <img
                        v-if="pet.image_url"
                        :src="pet.image_url"
                        :alt="pet.name"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                        <Icon name="mdi:paw" class="w-20 h-20 text-purple-300 dark:text-purple-700" />
                    </div>

                    <!-- Status Badge -->
                    <div class="absolute top-3 ltr:right-3 rtl:left-3" v-if="pet.status">
                        <span
                            :class="{
                                'bg-emerald-500 text-white': pet.status === 'active',
                                'bg-gray-500 text-white': pet.status === 'inactive',
                                'bg-red-500 text-white': pet.status === 'deceased',
                            }"
                            class="px-3 py-1 rounded-full text-xs font-bold capitalize shadow-lg">
                            {{ t(`pets.status.${pet.status}`) }}
                        </span>
                    </div>
                </div>

                <!-- Pet Info -->
                <div class="p-5">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1 min-w-0">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ pet.name }}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ t(`pets.${pet.species.toLowerCase()}`) }} • {{ pet.breed }}
                            </p>
                        </div>
                        <div class="flex-shrink-0 ltr:ml-2 rtl:mr-2">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                <Icon :name="getPetIcon(pet.species)" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2 mb-4">
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Icon name="mdi:account" class="w-4 h-4" />
                            <span class="truncate">{{ pet.owner?.name || t('pets.noOwner') }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Icon :name="pet.gender === 'male' ? 'mdi:gender-male' : 'mdi:gender-female'" class="w-4 h-4" />
                            <span>{{ t(`pets.${pet.gender}`) }}</span>
                            <span v-if="pet.age" class="ltr:ml-auto rtl:mr-auto">{{ pet.age }} {{ t('pets.years') }}</span>
                        </div>
                        <div v-if="pet.weight" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Icon name="mdi:weight" class="w-4 h-4" />
                            <span>{{ pet.weight }} kg</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
                        <button
                            @click.stop="editPet(pet.id)"
                            class="flex-1 flex items-center justify-start gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all font-medium text-sm">
                            <Icon name="mdi:pencil" class="w-4 h-4" />
                            {{ t('common.edit') }}
                        </button>
                        <button
                            @click.stop="deletePet(pet.id)"
                            class="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">
                            <Icon name="mdi:delete" class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="mt-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl px-6 py-4 border border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
                {{ t('common.showing') }} {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }} {{ t('common.to') }}
                {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} {{ t('common.of') }}
                {{ pagination.total }} {{ t('common.results') }}
            </div>
            <div class="flex gap-2">
                <button
                    @click="changePage(pagination.current_page - 1)"
                    :disabled="pagination.current_page === 1"
                    class="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {{ t('common.previous') }}
                </button>
                <button
                    @click="changePage(pagination.current_page + 1)"
                    :disabled="pagination.current_page === pagination.last_page"
                    class="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {{ t('common.next') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Pet } from '~/types'

definePageMeta({
    middleware: 'auth'
})

const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()
const router = useRouter()

const loading = ref(true)
const pets = ref<Pet[]>([])
const filters = ref({
    search: '',
    species: '',
    status: ''
})

const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0
})

let searchTimeout: NodeJS.Timeout

const debouncedSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchPets()
    }, 500)
}

const fetchPets = async (page: number = 1) => {
    loading.value = true
    try {
        const response = await $apiService.pets.getAll({
            page,
            per_page: pagination.value.per_page,
            search: filters.value.search || undefined,
            species: filters.value.species || undefined,
            status: filters.value.status || undefined
        })

        pets.value = response.data
        pagination.value = {
            current_page: response.current_page,
            last_page: response.last_page,
            per_page: response.per_page,
            total: response.total
        }
    } catch (error) {
        console.error('Error fetching pets:', handleError(error))
    } finally {
        loading.value = false
    }
}

const clearFilters = () => {
    filters.value = {
        search: '',
        species: '',
        status: ''
    }
    fetchPets()
}

const changePage = (page: number) => {
    fetchPets(page)
}

const viewPet = (id: number) => {
    router.push(`/pets/${id}`)
}

const editPet = (id: number) => {
    router.push(`/pets/create?id=${id}`)
}

const deletePet = async (id: number) => {
    if (!confirm(t('pets.confirmDelete'))) {
        return
    }

    try {
        await $apiService.pets.delete(id)
        await fetchPets()
    } catch (error) {
        console.error('Error deleting pet:', handleError(error))
        alert(t('pets.errorDeleting'))
    }
}

const getPetIcon = (species: string) => {
    const icons: Record<string, string> = {
        dog: 'mdi:dog',
        cat: 'mdi:cat',
        bird: 'mdi:bird',
        rabbit: 'mdi:rabbit',
    }
    return icons[species.toLowerCase()] || 'mdi:paw'
}

onMounted(() => {
    fetchPets()
})
</script>
