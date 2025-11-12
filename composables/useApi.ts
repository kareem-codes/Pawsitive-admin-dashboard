import type { Ref } from 'vue'

interface UseApiOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export const useApi = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async <T>(
    apiCall: () => Promise<T>,
    options: UseApiOptions = {}
  ): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await apiCall()
      
      if (options.onSuccess) {
        options.onSuccess(result)
      }
      
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred'
      error.value = errorMessage
      
      if (options.onError) {
        options.onError(err)
      } else {
        console.error('API Error:', err)
      }
      
      return null
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    loading.value = false
    error.value = null
  }

  return {
    loading,
    error,
    execute,
    reset
  }
}
