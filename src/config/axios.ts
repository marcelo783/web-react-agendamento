import axios from 'axios';

// Criando instância de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 🔥 GARANTE QUE OS COOKIES SEJAM ENVIADOS EM TODAS AS REQUISIÇÕES
});

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  response => response, // Se a resposta for OK, continue normalmente
  async (error) => {
    const originalRequest = error.config;

    // Se houver erro 401 (Unauthorized) e ainda não tentamos renovar
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Tentando renovar Access Token...");

        // 🔥 FAZ A REQUISIÇÃO PARA RENOVAR O TOKEN
        const refreshResponse = await api.post('/auth/refresh', {}, { withCredentials: true });

        const newAccessToken = refreshResponse.data.accessToken;

        console.log("✅ Novo Access Token recebido:", newAccessToken);

        // Atualiza o cabeçalho da requisição original
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Refaz a requisição original com o novo token
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Erro ao renovar Access Token:", refreshError);
        window.location.href = '/login'; // Redireciona para login se o refresh falhar
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
