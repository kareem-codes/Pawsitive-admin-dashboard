import { defineStore } from 'pinia'
import type { User } from '~/types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    isAuthenticated: false
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    async login(email: string, password: string) {
      const { $apiService } = useNuxtApp()
      try {
        const response = await $apiService.auth.login(email, password)
        this.token = response.data.token
        this.user = response.data.user
        this.isAuthenticated = true
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', this.token!)
          localStorage.setItem('user', JSON.stringify(this.user))
        }
        
        return response.data
      } catch (error) {
        throw error
      }
    },

    async logout() {
      const { $apiService } = useNuxtApp()
      try {
        await $apiService.auth.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.token = null
        this.user = null
        this.isAuthenticated = false
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
    },

    async fetchUser() {
      const { $apiService } = useNuxtApp()
      try {
        const response = await $apiService.auth.me()
        this.user = response.data
        this.isAuthenticated = true
      } catch (error) {
        this.logout()
        throw error
      }
    },

    initializeAuth() {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
          this.isAuthenticated = true
        }
      }
    }
  }
})
