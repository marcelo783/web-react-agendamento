import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // Certifique-se de que essa variável de ambiente esteja configurada corretamente
  headers: {
    'Content-Type': 'application/json',
  },
  
 // withCredentials: true, // Necessário para enviar cookies e lidar com autenticações que requerem credenciais
});

export default api;
