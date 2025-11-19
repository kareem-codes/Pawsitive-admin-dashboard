import axios from 'axios'
import { ApiService } from '~/services'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const toast = useToast();

  const api = axios.create({
    baseURL: config.public.apiBase as string,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: false, // Changed to false - using token auth, not cookies
    timeout: 30000, // 30 second timeout
  });

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Add authorization token
      const token = authStore.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add locale/language header - access from nuxtApp
      const i18n = nuxtApp.$i18n as any;
      const locale = i18n?.locale?.value || 'en';
      config.headers["Accept-Language"] = locale;
      config.headers["X-Locale"] = locale;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      const method = response.config.method?.toUpperCase();
      const url = response.config.url || '';
      
      // Get i18n instance
      const i18n = nuxtApp.$i18n as any;
      const t = i18n?.t || ((key: string) => key);
      
      // Show success toasts for CRUD operations
      if (method === 'POST' && !url.includes('/login') && !url.includes('/auth')) {
        toast.success(t('common.createdSuccessfully'));
      } else if (method === 'PUT' || method === 'PATCH') {
        toast.success(t('common.updatedSuccessfully'));
      } else if (method === 'DELETE') {
        toast.success(t('common.deletedSuccessfully'));
      }
      
      return response;
    },
    (error) => {
      const method = error.config?.method?.toUpperCase();
      
      // Get i18n instance
      const i18n = nuxtApp.$i18n as any;
      const t = i18n?.t || ((key: string) => key);
      
      // Handle network errors
      if (!error.response) {
        console.error(
          "Network error - API might be down or CORS is blocking the request"
        );
        console.error("Attempted URL:", error.config?.url);
        console.error("API Base:", config.public.apiBase);
        toast.error(t('common.networkError'));
      } else {
        // Show error toasts for CRUD operations
        const errorMessage = error.response?.data?.message || error.response?.data?.error;
        
        if (method === 'POST') {
          toast.error(errorMessage || t('common.failedToCreate'));
        } else if (method === 'PUT' || method === 'PATCH') {
          toast.error(errorMessage || t('common.failedToUpdate'));
        } else if (method === 'DELETE') {
          toast.error(errorMessage || t('common.failedToDelete'));
        } else if (method === 'GET') {
          toast.error(errorMessage || t('common.failedToLoad'));
        } else {
          toast.error(errorMessage || t('common.error'));
        }
      }

      if (error.response?.status === 401) {
        authStore.logout();
        navigateTo("/login");
      }
      return Promise.reject(error);
    }
  );

  const apiService = new ApiService(api);

  return {
    provide: {
      api,
      apiService,
    },
  };
});
