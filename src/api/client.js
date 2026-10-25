import axios from 'axios';

// Cliente Axios configurado con la URL base desde variables de entorno
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // Render (plan gratis) tarda en despertar tras inactividad
});

// Interceptor para inyectar token de autenticación (si existiera)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kanban_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para normalizar el error del backend { error: "mensaje" }
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendMessage = error.response?.data?.error;
    const customError = new Error(backendMessage || error.message || 'Error en la petición');
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export default apiClient;
