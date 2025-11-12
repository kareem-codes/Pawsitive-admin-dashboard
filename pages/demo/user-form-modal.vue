<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">UserFormModal Demo</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Demo Card 1: Create New User -->
      <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl border">
        <h3 class="text-lg font-semibold mb-4">Create New User</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Click the button to open the user creation modal. The component handles all validation and API calls.
        </p>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Icon name="mdi:account-plus" class="inline w-5 h-5 mr-2" />
          Create New User
        </button>
      </div>

      <!-- Demo Card 2: Edit User -->
      <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl border">
        <h3 class="text-lg font-semibold mb-4">Edit Existing User</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select a user ID to edit. The component will automatically fetch and populate the user data.
        </p>
        <div class="flex gap-2">
          <input
            v-model.number="demoUserId"
            type="number"
            placeholder="User ID"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white" />
          <button
            @click="editDemoUser"
            :disabled="!demoUserId"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            Edit
          </button>
        </div>
      </div>

      <!-- Demo Card 3: Quick Add (No Roles) -->
      <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl border">
        <h3 class="text-lg font-semibold mb-4">Quick Add (No Role Selection)</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Open user modal without role selection dropdown.
        </p>
        <button
          @click="showQuickAddModal = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Quick Add User
        </button>
      </div>

      <!-- Demo Card 4: Event Demonstration -->
      <div class="bg-white dark:bg-zinc-900 p-6 rounded-xl border">
        <h3 class="text-lg font-semibold mb-4">Event Handling Demo</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Open the modal and save to see event handling in action.
        </p>
        <button
          @click="showEventDemoModal = true"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mb-4">
          Open Event Demo
        </button>
        
        <!-- Event Log -->
        <div v-if="eventLog.length > 0" class="mt-4 p-3 bg-gray-100 dark:bg-zinc-800 rounded text-xs">
          <p class="font-semibold mb-2">Event Log:</p>
          <div v-for="(log, index) in eventLog" :key="index" class="text-gray-700 dark:text-gray-300">
            {{ log }}
          </div>
        </div>
      </div>
    </div>

    <!-- Results Display -->
    <div v-if="lastSavedUser" class="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
      <h3 class="text-lg font-semibold mb-2 text-green-900 dark:text-green-100">
        ✓ User Saved Successfully!
      </h3>
      <pre class="text-sm text-green-800 dark:text-green-200">{{ JSON.stringify(lastSavedUser, null, 2) }}</pre>
    </div>

    <!-- Error Display -->
    <div v-if="lastError" class="mt-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
      <h3 class="text-lg font-semibold mb-2 text-red-900 dark:text-red-100">
        ✗ Error Occurred
      </h3>
      <pre class="text-sm text-red-800 dark:text-red-200">{{ lastError }}</pre>
    </div>

    <!-- Modal Instances -->
    
    <!-- Create Modal -->
    <UserFormModal
      v-model="showCreateModal"
      @saved="handleUserSaved"
      @error="handleError"
      @close="handleClose('create')" />

    <!-- Edit Modal -->
    <UserFormModal
      v-model="showEditModal"
      :user-id="editingUserId"
      @saved="handleUserSaved"
      @error="handleError"
      @close="handleClose('edit')" />

    <!-- Quick Add Modal (No Roles) -->
    <UserFormModal
      v-model="showQuickAddModal"
      :show-role-selection="false"
      @saved="handleUserSaved"
      @error="handleError"
      @close="handleClose('quick-add')" />

    <!-- Event Demo Modal -->
    <UserFormModal
      v-model="showEventDemoModal"
      @saved="handleEventDemoSaved"
      @error="handleEventDemoError"
      @close="handleEventDemoClose" />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Create Modal
const showCreateModal = ref(false)

// Edit Modal
const showEditModal = ref(false)
const editingUserId = ref<number | null>(null)
const demoUserId = ref<number | null>(null)

// Quick Add Modal
const showQuickAddModal = ref(false)

// Event Demo Modal
const showEventDemoModal = ref(false)
const eventLog = ref<string[]>([])

// Results
const lastSavedUser = ref<any>(null)
const lastError = ref<string | null>(null)

const editDemoUser = () => {
  if (demoUserId.value) {
    editingUserId.value = demoUserId.value
    showEditModal.value = true
  }
}

const handleUserSaved = (user: any) => {
  console.log('User saved:', user)
  lastSavedUser.value = user
  lastError.value = null
  
  // Auto-clear after 5 seconds
  setTimeout(() => {
    lastSavedUser.value = null
  }, 5000)
}

const handleError = (error: any) => {
  console.error('Error:', error)
  lastError.value = error.response?.data?.message || error.message || 'Unknown error'
  lastSavedUser.value = null
  
  // Auto-clear after 5 seconds
  setTimeout(() => {
    lastError.value = null
  }, 5000)
}

const handleClose = (modalType: string) => {
  console.log(`${modalType} modal closed`)
  if (modalType === 'edit') {
    editingUserId.value = null
  }
}

// Event Demo Handlers
const handleEventDemoSaved = (user: any) => {
  eventLog.value.unshift(`✓ SAVED event fired - User: ${user.name}`)
  handleUserSaved(user)
}

const handleEventDemoError = (error: any) => {
  eventLog.value.unshift(`✗ ERROR event fired - ${error.message}`)
  handleError(error)
}

const handleEventDemoClose = () => {
  eventLog.value.unshift('⊗ CLOSE event fired')
}
</script>
