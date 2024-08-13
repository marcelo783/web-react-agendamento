import { authService } from '@/api/auth';
import authToken from '@/cookies/appCookies';
import React from 'react';
import { useCookies } from 'react-cookie';

const Login = () => {
  const [cookies, setCookie] = useCookies([authToken]);
  const {loginGoogle} = authService() 
  const handleGoogleLogin  =  async ()  => {
  //await loginGoogle().then(res => console.log(res.data))

    // Redireciona o usuário para a URL de autenticação do Google
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleGoogleLogin}
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
