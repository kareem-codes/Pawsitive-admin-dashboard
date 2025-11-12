export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Only run on client side
  if (import.meta.client) {
    // Initialize auth state from localStorage
    if (!authStore.isAuthenticated) {
      authStore.initializeAuth()
    }

    // If user is not authenticated and trying to access protected route
    if (!authStore.isAuthenticated && to.path !== '/login') {
      return navigateTo('/login')
    }

    // If user is authenticated and trying to access login page
    if (authStore.isAuthenticated && to.path === '/login') {
      return navigateTo('/')
    }
  }
})
