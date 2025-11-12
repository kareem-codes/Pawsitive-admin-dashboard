export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Only run on client-side to avoid hydration mismatch
  if (process.client) {
    authStore.initializeAuth()
  }
})
