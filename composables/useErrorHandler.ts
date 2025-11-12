export const useErrorHandler = () => {
  const handleError = (error: any, defaultMessage = 'An error occurred') => {
    if (!error) return defaultMessage

    // Handle axios errors
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          return data.message || 'Bad request'
        case 401:
          return 'Unauthorized. Please login again.'
        case 403:
          return 'You do not have permission to perform this action'
        case 404:
          return 'Resource not found'
        case 422:
          // Validation errors
          if (data.errors) {
            const firstError = Object.values(data.errors)[0]
            return Array.isArray(firstError) ? firstError[0] : firstError
          }
          return data.message || 'Validation error'
        case 500:
          return 'Server error. Please try again later.'
        default:
          return data.message || defaultMessage
      }
    }

    // Handle network errors
    if (error.request) {
      return 'Network error. Please check your connection.'
    }

    // Handle other errors
    return error.message || defaultMessage
  }

  const getValidationErrors = (error: any): Record<string, string[]> => {
    if (error.response?.status === 422 && error.response.data?.errors) {
      return error.response.data.errors
    }
    return {}
  }

  return {
    handleError,
    getValidationErrors
  }
}
