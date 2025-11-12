<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-950 dark:to-zinc-900">
    <!-- API Health Check Banner -->
    <ClientOnly>
      <ApiHealthCheck v-if="mounted && authStore.isAuthenticated" />
    </ClientOnly>

    <!-- Mobile Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="mounted && authStore.isAuthenticated && isMobileMenuOpen"
        @click="closeMobileMenu"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" />
    </Transition>

    <ClientOnly>
      <Sidebar v-if="mounted && authStore.isAuthenticated" :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />
    </ClientOnly>

    <div :class="mounted && authStore.isAuthenticated ? 'lg:ltr:pl-64 lg:rtl:pr-64' : ''" class="min-h-screen">
      <ClientOnly>
        <Header v-if="mounted && authStore.isAuthenticated" @toggle-mobile-menu="toggleMobileMenu" />
      </ClientOnly>
      <main class="py-6 px-4 sm:px-6 lg:px-8">
        <slot />
      </main>
    </div>
  </div>

  <!-- Toast Notifications -->
  <ClientOnly>
    <ToastNotification id="tosts-container" />
  </ClientOnly>

</template>

<script setup lang="ts">
const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)
const mounted = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  mounted.value = true
})
</script>
<style>
#tosts-container {
  z-index: 9999;
  border-radius: 8px;

  * {
    border-radius: 8px
  }
}
</style>
