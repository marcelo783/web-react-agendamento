import api from '../config/axios';

type Payload = {
  [key: string]: any;
};

export const authService = () => {
  async function login(payload: Payload) {
    return api.post('auth/login', payload);
  }

  async function cadastro(payload: Payload) {
    return api.post('auth/cadastro', payload);
  }

  async function  loginGoogle() {
    return api.get('auth/google');
  }

  return {
    login,
    cadastro,
    loginGoogle,
  };
};
