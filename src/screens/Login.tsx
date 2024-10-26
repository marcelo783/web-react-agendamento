import accessToken from '@/cookies/appAccessToken';
import authToken from '@/cookies/appCookies';
import { useEffect} from 'react';
import { useCookies } from 'react-cookie';
// Importar a imagem de erro

const Login = () => {
  const [cookies] = useCookies([authToken, accessToken]);
   // Estado para capturar o erro

  const handleGoogleLogin = async () => {
    
      // Redireciona o usuário para a URL de autenticação do Google
      window.location.href = 'http://localhost:5000/auth/google';
    
  };

  useEffect(() => {
    const storedAuthToken = cookies[authToken];
    const storedAccessToken = cookies[accessToken];

    if (storedAuthToken || storedAccessToken) {
      window.location.href = 'http://localhost:5173/adm';
    }
  }, [cookies]);

  // Renderizar a página de erro se ocorrer um erro
 

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
