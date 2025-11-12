export const useApiHealth = () => {
  const config = useRuntimeConfig();
  const isApiHealthy = ref(false);
  const isChecking = ref(false);
  const lastCheck = ref<Date | null>(null);
  const errorMessage = ref<string | null>(null);

  const checkApiHealth = async () => {
    isChecking.value = true;
    errorMessage.value = null;

    try {
      const response = await fetch(`${config.public.apiBase}/health`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        isApiHealthy.value = true;
        lastCheck.value = new Date();
        return true;
      } else {
        isApiHealthy.value = false;
        errorMessage.value = `API returned status: ${response.status}`;
        return false;
      }
    } catch (error: any) {
      isApiHealthy.value = false;

      if (
        error.message.includes("Failed to fetch") ||
        error.name === "TypeError"
      ) {
        errorMessage.value = `Cannot connect to API at ${config.public.apiBase}. Please ensure:
                    1. The backend server is running
                    2. CORS is configured correctly
                    3. The API URL is correct in .env file`;
      } else {
        errorMessage.value = error.message;
      }

      console.error("API Health Check Failed:", {
        apiBase: config.public.apiBase,
        error: error.message,
        name: error.name,
      });

      return false;
    } finally {
      isChecking.value = false;
      lastCheck.value = new Date();
    }
  };

  return {
    isApiHealthy,
    isChecking,
    lastCheck,
    errorMessage,
    checkApiHealth,
  };
};
