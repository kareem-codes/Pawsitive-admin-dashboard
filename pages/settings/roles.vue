<template>
  <div class="animate-fade-in max-w-7xl mx-auto">
    <!-- Breadcrumb -->
    <nav class="mb-4 flex items-center gap-2 text-sm">
      <NuxtLink to="/settings" class="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        {{ t('nav.settings') }}
      </NuxtLink>
      <Icon name="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
      <span class="text-gray-900 dark:text-white font-medium">{{ t('settings.rolesPermissions') }}</span>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {{ t('settings.rolesPermissions') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('settings.rolesPermissionsSubtitle') }}</p>
    </div>

    <!-- Error/Success Alerts -->
    <div v-if="error" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
      <Icon name="mdi:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
      <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
    </div>
    <div v-if="success" class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
      <Icon name="mdi:check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
      <p class="text-sm text-green-700 dark:text-green-400">{{ success }}</p>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Roles List (Left - Takes 1/3) -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('settings.roles') }}</h2>
            <button
              @click="showCreateRoleModal = true"
              class="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              :title="t('settings.createRole')">
              <Icon name="mdi:plus" class="w-5 h-5" />
            </button>
          </div>
          
          <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-zinc-800">
            <div
              v-for="role in roles"
              :key="role.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
              :class="{ 'bg-indigo-50 dark:bg-indigo-900/20': selectedRole?.id === role.id }"
              @click="selectedRole = role">
              <div class="flex items-center justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 dark:text-white capitalize truncate">{{ role.name }}</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {{ role.permissions?.length || 0 }} {{ t('settings.permissions') }}
                  </p>
                </div>
                <div class="flex gap-1 flex-shrink-0">
                  <button
                    @click.stop="editRole(role)"
                    class="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    :title="t('common.edit')">
                    <Icon name="mdi:pencil" class="w-4 h-4" />
                  </button>
                  <button
                    @click.stop="deleteRole(role)"
                    class="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    :title="t('common.delete')">
                    <Icon name="mdi:delete" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side (Takes 2/3) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Selected Role Details -->
        <div v-if="selectedRole" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-zinc-800">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white capitalize flex items-center gap-2">
              <Icon name="mdi:shield-account" class="w-5 h-5 text-indigo-600" />
              {{ selectedRole.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ selectedRole.permissions?.length || 0 }} {{ t('settings.permissions') }} {{ t('settings.assignPermissions').toLowerCase() }}
            </p>
          </div>
          
          <div class="p-6">
            <div v-if="selectedRole.permissions?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                v-for="permission in selectedRole.permissions"
                :key="permission.id"
                class="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm flex items-center gap-2">
                <Icon name="mdi:check" class="w-4 h-4 flex-shrink-0" />
                <span class="truncate">{{ permission.name }}</span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <Icon name="mdi:shield-off" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 dark:text-gray-400">{{ t('settings.noPermissions') }}</p>
            </div>
          </div>
        </div>

        <!-- All Permissions List -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('settings.permissions') }}</h2>
            <button
              @click="showCreatePermissionModal = true"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
              <Icon name="mdi:plus" class="w-4 h-4" />
              {{ t('settings.add') }}
            </button>
          </div>

          <div v-if="loadingPermissions" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>

          <div v-else class="p-6">
            <div v-if="Object.keys(groupedPermissions).length" class="space-y-6">
              <div v-for="(groupPermissions, group) in groupedPermissions" :key="group" class="space-y-3">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Icon name="mdi:folder" class="w-4 h-4" />
                  {{ group }}
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                  <div
                    v-for="permission in groupPermissions"
                    :key="permission.id"
                    class="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 transition-colors">
                    <span class="text-sm text-gray-900 dark:text-white truncate">{{ permission.name }}</span>
                    <button
                      @click="deletePermission(permission)"
                      class="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex-shrink-0"
                      :title="t('common.delete')">
                      <Icon name="mdi:close" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <Icon name="mdi:lock-off" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 dark:text-gray-400">{{ t('settings.noPermissions') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Role Modal -->
    <teleport to="body">
      <div
        v-if="showCreateRoleModal || editingRole"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="closeRoleModal">
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-zinc-800">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ editingRole ? t('settings.editRole') : t('settings.createRole') }}
            </h3>
          </div>
          
          <div class="p-6 space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('settings.roleName') }}
              </label>
              <input
                v-model="roleForm.name"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                :placeholder="t('settings.roleNamePlaceholder')" />
            </div>

            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t('settings.assignPermissions') }}
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  <input
                    type="checkbox"
                    :checked="isAllPermissionsSelected"
                    @change="toggleAllPermissions"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <span>{{ t('settings.selectAll') }}</span>
                </label>
              </div>
              <div class="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
                <div v-for="(groupPermissions, group) in groupedPermissions" :key="group" class="space-y-2">
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2 sticky top-0 bg-gray-50 dark:bg-zinc-800 py-1">
                    <Icon name="mdi:folder" class="w-4 h-4" />
                    {{ group }}
                  </h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                    <label
                      v-for="permission in groupPermissions"
                      :key="permission.id"
                      class="flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        :value="permission.name"
                        v-model="roleForm.permissions"
                        class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                      <span class="text-sm text-gray-900 dark:text-white">{{ permission.name }}</span>
                    </label>
                  </div>
                </div>
              </div>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {{ roleForm.permissions.length }} {{ t('settings.permissions') }} {{ t('settings.selected') }}
              </p>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-3">
            <button
              @click="closeRoleModal"
              class="px-6 py-2.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              {{ t('common.cancel') }}
            </button>
            <button
              @click="saveRole"
              :disabled="saving"
              class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
              {{ saving ? t('common.saving') : t('common.save') }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Create Permission Modal -->
    <teleport to="body">
      <div
        v-if="showCreatePermissionModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showCreatePermissionModal = false">
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full">
          <div class="p-6 border-b border-gray-200 dark:border-zinc-800">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('settings.createPermission') }}</h3>
          </div>
          
          <div class="p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('settings.permissionName') }}
            </label>
            <input
              v-model="permissionForm.name"
              type="text"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
              :placeholder="t('settings.permissionNamePlaceholder')" />
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {{ t('settings.permissionNameHint') }}
            </p>
          </div>

          <div class="p-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-3">
            <button
              @click="showCreatePermissionModal = false"
              class="px-6 py-2.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              {{ t('common.cancel') }}
            </button>
            <button
              @click="createPermission"
              :disabled="saving"
              class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
              {{ saving ? t('common.creating') : t('common.create') }}
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
const { t } = useI18n()
const { $api } = useNuxtApp()

const loading = ref(false)
const loadingPermissions = ref(false)
const saving = ref(false)
const error = ref(null)
const success = ref(null)

const roles = ref([])
const permissions = ref({})
const selectedRole = ref(null)
const editingRole = ref(null)
const showCreateRoleModal = ref(false)
const showCreatePermissionModal = ref(false)

const roleForm = ref({
  name: '',
  permissions: []
})

const permissionForm = ref({
  name: ''
})

const groupedPermissions = computed(() => permissions.value)

const allPermissionNames = computed(() => {
  const allPerms = []
  Object.values(permissions.value).forEach(group => {
    group.forEach(perm => allPerms.push(perm.name))
  })
  return allPerms
})

const isAllPermissionsSelected = computed(() => {
  return allPermissionNames.value.length > 0 && 
         roleForm.value.permissions.length === allPermissionNames.value.length
})

const toggleAllPermissions = () => {
  if (isAllPermissionsSelected.value) {
    roleForm.value.permissions = []
  } else {
    roleForm.value.permissions = [...allPermissionNames.value]
  }
}

const fetchRoles = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $api.get('/roles')
    roles.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  } finally {
    loading.value = false
  }
}

const fetchPermissions = async () => {
  loadingPermissions.value = true
  error.value = null
  try {
    const response = await $api.get('/permissions')
    permissions.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  } finally {
    loadingPermissions.value = false
  }
}

const saveRole = async () => {
  saving.value = true
  error.value = null
  success.value = null
  
  try {
    if (editingRole.value) {
      await $api.put(`/roles/${editingRole.value.id}`, roleForm.value)
      success.value = t('settings.roleUpdatedSuccess')
    } else {
      await $api.post('/roles', roleForm.value)
      success.value = t('settings.roleCreatedSuccess')
    }
    
    closeRoleModal()
    await fetchRoles()
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  } finally {
    saving.value = false
  }
}

const editRole = (role) => {
  editingRole.value = role
  roleForm.value = {
    name: role.name,
    permissions: role.permissions?.map(p => p.name) || []
  }
}

const deleteRole = async (role) => {
  if (!confirm(t('settings.confirmDeleteRole'))) return
  
  error.value = null
  success.value = null
  
  try {
    await $api.delete(`/roles/${role.id}`)
    success.value = t('settings.roleDeletedSuccess')
    await fetchRoles()
    if (selectedRole.value?.id === role.id) {
      selectedRole.value = null
    }
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  }
}

const createPermission = async () => {
  saving.value = true
  error.value = null
  success.value = null
  
  try {
    await $api.post('/permissions', permissionForm.value)
    success.value = t('settings.permissionCreatedSuccess')
    showCreatePermissionModal.value = false
    permissionForm.value.name = ''
    await fetchPermissions()
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  } finally {
    saving.value = false
  }
}

const deletePermission = async (permission) => {
  if (!confirm(t('settings.confirmDeletePermission'))) return
  
  error.value = null
  success.value = null
  
  try {
    await $api.delete(`/permissions/${permission.id}`)
    success.value = t('settings.permissionDeletedSuccess')
    await fetchPermissions()
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorOccurred')
  }
}

const closeRoleModal = () => {
  showCreateRoleModal.value = false
  editingRole.value = null
  roleForm.value = {
    name: '',
    permissions: []
  }
}

onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>
