<template>
  <div class="animate-fade-in">
    <!-- Breadcrumb -->
    <nav class="mb-4 flex items-center gap-2 text-sm">
      <NuxtLink to="/settings" class="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        {{ t('nav.settings') }}
      </NuxtLink>
      <Icon name="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
      <span class="text-gray-900 dark:text-white font-medium">{{ t('settings.userManagement') }}</span>
    </nav>

    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {{ t('settings.userManagement') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('settings.userManagementSubtitle') }}</p>
      </div>
      <button
        v-if="hasPermission('create users')"
        @click="showUserModal = true"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
        <Icon name="mdi:account-plus" class="w-5 h-5" />
        {{ t('settings.createUser') }}
      </button>
    </div>

    <!-- Filters -->
    <div class="mb-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 p-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <input
            v-model="filters.search"
            type="text"
            :placeholder="t('common.search')"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white" />
        </div>
        <div>
          <select
            v-model="filters.role"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white">
            <option value="">{{ t('settings.allRoles') }}</option>
            <option v-for="role in roles" :key="role.id" :value="role.name">{{ role.name }}</option>
          </select>
        </div>
        <div>
          <select
            v-model="filters.is_active"
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white">
            <option value="">{{ t('settings.allStatuses') }}</option>
            <option value="1">{{ t('settings.active') }}</option>
            <option value="0">{{ t('settings.inactive') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Error/Success Alerts -->
    <div v-if="error" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
      <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
    </div>
    <div v-if="success" class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
      <p class="text-sm text-green-700 dark:text-green-400">{{ success }}</p>
    </div>

    <!-- Users List -->
    <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="users.length === 0" class="text-center py-12">
        <Icon name="mdi:account-off" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">{{ t('settings.noUsers') }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('settings.user') }}
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('settings.contact') }}
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('settings.role') }}
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('settings.status') }}
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-zinc-800">
            <tr
              v-for="user in users"
              :key="user.id"
              class="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {{ user.name?.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900 dark:text-white">{{ user.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white">{{ user.phone || 'N/A' }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.phone_secondary || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4">
                <span
                  v-for="role in user.roles"
                  :key="role.id"
                  class="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                  {{ role.name }}
                </span>
                <span v-if="!user.roles || user.roles.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t('settings.noRole') }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex px-3 py-1 rounded-full text-xs font-medium',
                    user.is_active
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  ]">
                  {{ user.is_active ? t('settings.active') : t('settings.inactive') }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="editUser(user)"
                    class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    :title="t('common.edit')">
                    <Icon name="mdi:pencil" class="w-5 h-5" />
                  </button>
                  <button
                    @click="assignRoleModal(user)"
                    class="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                    :title="t('settings.assignRole')">
                    <Icon name="mdi:shield-account" class="w-5 h-5" />
                  </button>
                  <button
                    @click="deleteUser(user)"
                    class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    :title="t('common.delete')">
                    <Icon name="mdi:delete" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.per_page" class="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('common.showing') }} {{ pagination.from }} {{ t('common.to') }} {{ pagination.to }} {{ t('common.of') }} {{ pagination.total }}
          </div>
          <div class="flex gap-2">
            <button
              v-for="page in paginationPages"
              :key="page"
              @click="fetchUsers(page)"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                page === pagination.current_page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
              ]">
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <UserFormModal
      v-model="showUserModal"
      :user-id="editingUserId"
      @saved="handleUserSaved"
      @close="handleUserModalClose" />

    <!-- Assign Role Modal -->
    <Modal
      v-model="showAssignRoleModal"
      :title="t('settings.assignRole')"
      size="md"
      :cancel-text="t('common.cancel')"
      :confirm-text="saving ? t('common.assigning') : t('common.assign')"
      :loading="saving"
      :loading-text="t('common.assigning')"
      :confirm-disabled="!selectedRoleForUser"
      @confirm="assignRole"
      @close="showAssignRoleModal = false">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('settings.selectRole') }}
        </label>
        <select
          v-model="selectedRoleForUser"
          class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white">
          <option value="">{{ t('settings.selectRole') }}</option>
          <option v-for="role in roles" :key="role.id" :value="role.name">{{ role.name }}</option>
        </select>
      </div>
    </Modal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const { $api } = useNuxtApp()
const { hasPermission } = usePermissions()

const loading = ref(false)
const saving = ref(false)
const error = ref(null)
const success = ref(null)

const users = ref([])
const roles = ref([])
const pagination = ref({
  current_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})

const filters = ref({
  search: '',
  role: '',
  is_active: ''
})

const showUserModal = ref(false)
const editingUserId = ref(null)
const showAssignRoleModal = ref(false)
const assigningRoleUser = ref(null)
const selectedRoleForUser = ref('')

const userForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  role: '',
  is_active: true
})

const paginationPages = computed(() => {
  const pages = []
  const total = Math.ceil(pagination.value.total / pagination.value.per_page)
  for (let i = 1; i <= total; i++) {
    pages.push(i)
  }
  return pages
})

const fetchUsers = async (page = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const params = {
      page,
      per_page: pagination.value.per_page,
      ...Object.fromEntries(Object.entries(filters.value).filter(([_, v]) => v !== ''))
    }
    
    const response = await $api.get('/users', { params })
    users.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to
    }
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  } finally {
    loading.value = false
  }
}

const fetchRoles = async () => {
  try {
    const response = await $api.get('/roles')
    roles.value = response.data
  } catch (err) {
    console.error('Failed to fetch roles:', err)
  }
}

const handleUserSaved = async (user) => {
  success.value = editingUserId.value 
    ? t('settings.userUpdatedSuccess') 
    : t('settings.userCreatedSuccess')
  
  await fetchUsers(pagination.value.current_page)
  
  // Clear success message after 3 seconds
  setTimeout(() => {
    success.value = null
  }, 3000)
}

const handleUserModalClose = () => {
  editingUserId.value = null
}

const saveUser = async () => {
  // This function is no longer needed - kept for compatibility
  console.warn('saveUser is deprecated - using UserFormModal instead')
}

const editUser = (user) => {
  editingUserId.value = user.id
  showUserModal.value = true
}

const deleteUser = async (user) => {
  if (!confirm(t('settings.confirmDeleteUser'))) return
  
  error.value = null
  success.value = null
  
  try {
    await $api.delete(`/users/${user.id}`)
    success.value = t('settings.userDeletedSuccess')
    await fetchUsers(pagination.value.current_page)
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  }
}

const assignRoleModal = (user) => {
  assigningRoleUser.value = user
  selectedRoleForUser.value = user.roles?.[0]?.name || ''
  showAssignRoleModal.value = true
}

const assignRole = async () => {
  if (!selectedRoleForUser.value) return
  
  saving.value = true
  error.value = null
  success.value = null
  
  try {
    await $api.post(`/users/${assigningRoleUser.value.id}/assign-role`, {
      role: selectedRoleForUser.value
    })
    success.value = t('settings.roleAssignedSuccess')
    showAssignRoleModal.value = false
    assigningRoleUser.value = null
    selectedRoleForUser.value = ''
    await fetchUsers(pagination.value.current_page)
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showUserModal.value = false
  editingUserId.value = null
  error.value = null
}

watch(filters, () => {
  fetchUsers(1)
}, { deep: true })

onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script>
