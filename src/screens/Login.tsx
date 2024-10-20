import { authService } from '@/api/auth';
import Navbar from '@/components/LandingPage/Navbar/Navbar';
import accessToken from '@/cookies/appAccessToken';
import authToken from '@/cookies/appCookies';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
//import { Navbar } from "../components/LandingPage/Navbar/Navbar";


const Login = () => {
  const [cookies, setCookie] = useCookies([authToken, accessToken]);
  const {loginGoogle} = authService() 

  const handleGoogleLogin  =  async ()  => {
  //await loginGoogle().then(res => console.log(res.data))

    // Redireciona o usuário para a URL de autenticação do Google
    window.location.href = 'http://localhost:5000/auth/google';
  };

  useEffect(() => {
    // Quando o componente carrega, verifica se o cookie de token está presente
    const storedAuthToken = cookies[authToken];
    const storedAccessToken = cookies[accessToken];

    if (storedAuthToken) {
      console.log('Usuário autenticado com authToken:', storedAuthToken);
      // Redirecionar para a página de administração se o usuário já estiver autenticado
      window.location.href = 'http://localhost:5173/adm';
    }

    if (storedAccessToken) {
      console.log('Access Token capturado:', storedAccessToken);
      // Redirecionar para a página de administração se o usuário já estiver autenticado
      window.location.href = 'http://localhost:5173/adm';
    }
  }, [cookies]);
  

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