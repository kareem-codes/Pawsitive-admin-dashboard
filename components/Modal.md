# Modal Component Usage Guide

## Overview
The `Modal` component is a reusable, accessible modal dialog that can be used throughout the application for various purposes like forms, confirmations, alerts, etc.

## Basic Usage

```vue
<template>
  <Modal
    v-model="showModal"
    title="Modal Title"
    @confirm="handleConfirm"
    @close="handleClose">
    <p>Your modal content goes here</p>
  </Modal>
</template>

<script setup>
const showModal = ref(false)

const handleConfirm = () => {
  // Handle confirm action
  showModal.value = false
}

const handleClose = () => {
  // Handle close action
  console.log('Modal closed')
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Boolean` | **required** | Controls modal visibility (use with v-model) |
| `title` | `String` | **required** | Modal title text |
| `subtitle` | `String` | `''` | Optional subtitle below the title |
| `size` | `String` | `'md'` | Modal width: 'sm', 'md', 'lg', 'xl', '2xl', 'full' |
| `showClose` | `Boolean` | `true` | Show close button in header |
| `closeOnBackdrop` | `Boolean` | `true` | Close modal when clicking backdrop |
| `showDefaultFooter` | `Boolean` | `true` | Show default footer with buttons |
| `showCancel` | `Boolean` | `true` | Show cancel button in footer |
| `showConfirm` | `Boolean` | `true` | Show confirm button in footer |
| `cancelText` | `String` | `'Cancel'` | Text for cancel button |
| `confirmText` | `String` | `'Confirm'` | Text for confirm button |
| `loadingText` | `String` | `'Loading...'` | Text shown when loading |
| `confirmVariant` | `String` | `'primary'` | Button style: 'primary', 'danger', 'success' |
| `confirmDisabled` | `Boolean` | `false` | Disable confirm button |
| `loading` | `Boolean` | `false` | Show loading state on confirm button |

## Events

| Event | Description |
|-------|-------------|
| `update:modelValue` | Emitted when modal visibility changes |
| `close` | Emitted when modal is closed |
| `confirm` | Emitted when confirm button is clicked |

## Examples

### 1. Simple Confirmation Dialog

```vue
<Modal
  v-model="showDeleteModal"
  title="Delete Item"
  subtitle="This action cannot be undone"
  size="sm"
  confirm-variant="danger"
  :confirm-text="t('common.delete')"
  :cancel-text="t('common.cancel')"
  @confirm="deleteItem">
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

### 2. Form Modal with Loading State

```vue
<Modal
  v-model="showEditModal"
  title="Edit User"
  size="2xl"
  :loading="saving"
  :confirm-text="saving ? 'Saving...' : 'Save'"
  :loading-text="t('common.saving')"
  @confirm="saveUser"
  @close="resetForm">
  <div class="space-y-4">
    <div>
      <label>Name</label>
      <input v-model="form.name" type="text" />
    </div>
    <div>
      <label>Email</label>
      <input v-model="form.email" type="email" />
    </div>
  </div>
</Modal>
```

### 3. Custom Footer with Slots

```vue
<Modal
  v-model="showCustomModal"
  title="Custom Actions"
  :show-default-footer="false">
  <p>Modal content here</p>
  
  <template #footer>
    <div class="flex justify-between w-full">
      <button @click="handleAction1">Action 1</button>
      <div class="flex gap-2">
        <button @click="handleAction2">Action 2</button>
        <button @click="showCustomModal = false">Close</button>
      </div>
    </div>
  </template>
</Modal>
```

### 4. Full Width Modal

```vue
<Modal
  v-model="showFullModal"
  title="Full Width Content"
  size="full"
  :show-confirm="false"
  :cancel-text="t('common.close')">
  <!-- Wide content like tables, charts, etc. -->
</Modal>
```

### 5. Success Confirmation

```vue
<Modal
  v-model="showSuccessModal"
  title="Success!"
  size="sm"
  confirm-variant="success"
  :show-cancel="false"
  confirm-text="Got it!"
  @confirm="showSuccessModal = false">
  <div class="text-center">
    <Icon name="mdi:check-circle" class="w-16 h-16 text-green-500 mx-auto mb-4" />
    <p>Your changes have been saved successfully.</p>
  </div>
</Modal>
```

### 6. Alert/Info Modal (No Footer)

```vue
<Modal
  v-model="showInfoModal"
  title="Information"
  size="md"
  :show-default-footer="false"
  :close-on-backdrop="false">
  <p>Important information that requires acknowledgment.</p>
  
  <template #footer>
    <button
      @click="acknowledgeInfo"
      class="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl">
      I Understand
    </button>
  </template>
</Modal>
```

## Features

- ✅ **Responsive**: Works on all screen sizes
- ✅ **Accessible**: Keyboard navigation (ESC to close)
- ✅ **Animated**: Smooth enter/exit transitions
- ✅ **Dark Mode**: Automatic dark mode support
- ✅ **Flexible**: Customizable via props and slots
- ✅ **Loading States**: Built-in loading indicator
- ✅ **Multiple Sizes**: 6 predefined sizes
- ✅ **Backdrop Control**: Optional click-outside-to-close
- ✅ **Teleport**: Renders in document body for proper z-index

## Tips

1. Use `v-model` to control visibility
2. Set `size` based on content width needs
3. Use `confirmVariant="danger"` for destructive actions
4. Disable confirm button with `:confirm-disabled="!isValid"`
5. Show loading state during async operations
6. Use slots for complete customization
7. Close on confirm by setting `modelValue` to false in handler
