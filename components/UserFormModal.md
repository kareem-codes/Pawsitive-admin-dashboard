# UserFormModal Component

## Overview
A fully self-contained, reusable component for creating and editing users anywhere in your application. This component includes all the logic, validation, and API calls needed to manage users - no need to write backend integration code!

## Features
✅ **Create new users** with full validation  
✅ **Edit existing users** by passing user ID  
✅ **Built-in API integration** - handles all requests  
✅ **Form validation** with error messages  
✅ **Role selection** with automatic role fetching  
✅ **Loading states** and error handling  
✅ **Password confirmation** for new users  
✅ **Active/Inactive toggle**  
✅ **Toast notifications** via events  
✅ **Dark mode support**  
✅ **Internationalization ready**  

## Basic Usage

### Create New User
```vue
<template>
  <div>
    <button @click="showModal = true">Add User</button>
    
    <UserFormModal
      v-model="showModal"
      @saved="handleUserSaved" />
  </div>
</template>

<script setup>
const showModal = ref(false)

const handleUserSaved = (user) => {
  console.log('User saved:', user)
  // Refresh your user list here
}
</script>
```

### Edit Existing User
```vue
<template>
  <div>
    <button @click="editUser(123)">Edit User</button>
    
    <UserFormModal
      v-model="showModal"
      :user-id="selectedUserId"
      @saved="handleUserSaved" />
  </div>
</template>

<script setup>
const showModal = ref(false)
const selectedUserId = ref(null)

const editUser = (userId) => {
  selectedUserId.value = userId
  showModal.value = true
}

const handleUserSaved = (user) => {
  console.log('User updated:', user)
  selectedUserId.value = null
  // Refresh your user list
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Boolean` | `false` | Controls modal visibility (use with v-model) |
| `userId` | `Number \| String \| null` | `null` | User ID for editing. If null, creates new user |
| `showRoleSelection` | `Boolean` | `true` | Show role selection dropdown |
| `autoFetchRoles` | `Boolean` | `true` | Automatically fetch available roles |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Boolean` | Emitted when modal visibility changes |
| `saved` | `Object` | Emitted when user is successfully created/updated. Returns user object |
| `error` | `Error` | Emitted when an error occurs during save |
| `close` | - | Emitted when modal is closed |

## Examples

### 1. Simple Create User (Minimal Setup)
```vue
<template>
  <UserFormModal v-model="showCreate" @saved="userCreated" />
</template>

<script setup>
const showCreate = ref(false)
const userCreated = (user) => {
  console.log('New user:', user)
}
</script>
```

### 2. With Custom Success Handling
```vue
<template>
  <UserFormModal
    v-model="showModal"
    :user-id="editingId"
    @saved="handleSuccess"
    @error="handleError" />
</template>

<script setup>
const toast = useToast()

const handleSuccess = (user) => {
  toast.success(`User ${user.name} saved successfully!`)
  refreshUserList()
}

const handleError = (error) => {
  toast.error('Failed to save user')
  console.error(error)
}
</script>
```

### 3. Without Role Selection
```vue
<template>
  <UserFormModal
    v-model="showModal"
    :show-role-selection="false"
    @saved="userSaved" />
</template>

<script setup>
// Perfect for contexts where roles are managed separately
</script>
```

### 4. In a Table/List View
```vue
<template>
  <div>
    <!-- Users Table -->
    <table>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.name }}</td>
        <td>
          <button @click="openEdit(user.id)">Edit</button>
        </td>
      </tr>
    </table>

    <!-- Reusable User Modal -->
    <UserFormModal
      v-model="showModal"
      :user-id="selectedUserId"
      @saved="handleSaved"
      @close="selectedUserId = null" />
  </div>
</template>

<script setup>
const users = ref([])
const showModal = ref(false)
const selectedUserId = ref(null)

const openEdit = (id) => {
  selectedUserId.value = id
  showModal.value = true
}

const handleSaved = async () => {
  // Refresh the list
  await fetchUsers()
  selectedUserId.value = null
}

const fetchUsers = async () => {
  // Your fetch logic
}
</script>
```

### 5. Quick Add from Any Page
```vue
<template>
  <div>
    <!-- Your page content -->
    <button @click="quickAddUser" class="btn-primary">
      <Icon name="mdi:account-plus" />
      Quick Add User
    </button>

    <!-- Drop-in component - works anywhere! -->
    <UserFormModal v-model="showQuickAdd" @saved="handleQuickAdd" />
  </div>
</template>

<script setup>
const showQuickAdd = ref(false)
const toast = useToast()

const quickAddUser = () => {
  showQuickAdd.value = true
}

const handleQuickAdd = (user) => {
  toast.success(`${user.name} added successfully!`)
  // Do whatever you need with the new user
}
</script>
```

### 6. With Loading Indicator
```vue
<template>
  <div>
    <button @click="createUser" :disabled="loading">
      {{ loading ? 'Processing...' : 'Create User' }}
    </button>

    <UserFormModal
      v-model="showModal"
      @saved="handleSaved" />
  </div>
</template>

<script setup>
const loading = ref(false)
const showModal = ref(false)

const createUser = () => {
  showModal.value = true
}

const handleSaved = async (user) => {
  loading.value = true
  try {
    // Additional processing if needed
    await someAdditionalAction(user)
  } finally {
    loading.value = false
  }
}
</script>
```

## API Endpoints Used

The component automatically calls these endpoints:

- **Create User**: `POST /users`
- **Update User**: `PUT /users/{id}`
- **Get User**: `GET /users/{id}` (when editing)
- **Get Roles**: `GET /roles` (if `showRoleSelection` is true)

## Form Fields

### Required Fields (Create Mode)
- Name
- Email
- Password
- Password Confirmation

### Required Fields (Edit Mode)
- Name
- Email

### Optional Fields
- Phone
- Role (if `showRoleSelection` is true)
- Active Status (checkbox)

## Validation

The component includes built-in validation:
- ✅ Name required
- ✅ Email required and valid format
- ✅ Password required (create only)
- ✅ Password min length 8 characters
- ✅ Password confirmation match
- ✅ Real-time error display

## Advanced Usage

### Access Component Methods
```vue
<template>
  <UserFormModal
    ref="userModal"
    v-model="showModal"
    @saved="handleSaved" />
</template>

<script setup>
const userModal = ref(null)

// Reset form programmatically
const resetUserForm = () => {
  userModal.value?.resetForm()
}

// Manually refresh user data
const refreshUser = () => {
  userModal.value?.fetchUser()
}

// Manually refresh roles
const refreshRoles = () => {
  userModal.value?.fetchRoles()
}
</script>
```

### Custom Error Handling
```vue
<template>
  <UserFormModal
    v-model="showModal"
    @error="handleError" />
</template>

<script setup>
const handleError = (error) => {
  if (error.response?.status === 422) {
    // Validation errors
    console.log('Validation failed:', error.response.data.errors)
  } else if (error.response?.status === 403) {
    // Permission denied
    alert('You do not have permission to perform this action')
  } else {
    // Other errors
    console.error('Unexpected error:', error)
  }
}
</script>
```

## Real-World Use Cases

### 1. Admin Panel
```vue
<!-- In pages/admin/users.vue -->
<UserFormModal
  v-model="showUserModal"
  :user-id="editingUserId"
  @saved="refreshUserList" />
```

### 2. Team Management
```vue
<!-- In pages/team/index.vue -->
<UserFormModal
  v-model="showAddMember"
  :show-role-selection="true"
  @saved="addedToTeam" />
```

### 3. Quick Actions Dropdown
```vue
<!-- In any component -->
<DropdownMenu>
  <DropdownItem @click="showUserModal = true">
    Add New User
  </DropdownItem>
</DropdownMenu>

<UserFormModal v-model="showUserModal" @saved="handleNewUser" />
```

### 4. Onboarding Flow
```vue
<!-- In pages/onboarding.vue -->
<UserFormModal
  v-model="showOnboarding"
  :auto-fetch-roles="false"
  :show-role-selection="false"
  @saved="completeOnboarding" />
```

## Tips & Best Practices

1. **Always handle the `@saved` event** to refresh your user list or update UI
2. **Use `user-id` prop** to switch between create and edit modes
3. **Reset `userId` to null** after saving to prepare for next use
4. **Handle `@error` event** for better UX and debugging
5. **Set `showRoleSelection="false"`** if roles aren't needed
6. **Use `v-model`** for cleaner modal control
7. **Component handles all API calls** - no need to duplicate logic

## Component Benefits

✨ **Zero Configuration** - Works out of the box  
🔄 **Fully Reusable** - Use anywhere in your app  
🛡️ **Built-in Validation** - Comprehensive form validation  
🌐 **I18n Ready** - Translation support included  
🎨 **Styled** - Matches your dashboard theme  
📱 **Responsive** - Works on all devices  
♿ **Accessible** - Keyboard navigation support  
🔒 **Secure** - Handles sensitive data properly  

## Migration from Old Code

### Before (Manual Implementation)
```vue
<script setup>
// 50+ lines of form handling
// API calls
// Validation
// Error handling
// State management
</script>
```

### After (Using UserFormModal)
```vue
<script setup>
const showModal = ref(false)
const userId = ref(null)

const handleSaved = async () => {
  await refreshUsers()
}
</script>

<template>
  <UserFormModal
    v-model="showModal"
    :user-id="userId"
    @saved="handleSaved" />
</template>
```

**Result**: 90% less code, consistent behavior, easier maintenance!
