interface ToastOptions {
  title?: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export const useToast = () => {
  const toasts = useState<ToastOptions[]>('toasts', () => [])

  const show = (options: ToastOptions) => {
    const toast = {
      ...options,
      duration: options.duration || 3000
    }
    
    toasts.value.push(toast)
    
    setTimeout(() => {
      const index = toasts.value.indexOf(toast)
      if (index > -1) {
        toasts.value.splice(index, 1)
      }
    }, toast.duration)
  }

  const success = (message: string, title?: string) => {
    show({ message, title, type: 'success' })
  }

  const error = (message: string, title?: string) => {
    show({ message, title, type: 'error' })
  }

  const info = (message: string, title?: string) => {
    show({ message, title, type: 'info' })
  }

  const warning = (message: string, title?: string) => {
    show({ message, title, type: 'warning' })
  }

  return {
    toasts,
    show,
    success,
    error,
    info,
    warning
  }
}
