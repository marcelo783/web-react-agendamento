import { useCookies } from 'react-cookie';
import { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [cookies, setCookie] = useCookies(['authToken']);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthToken = () => {
      console.log('Tentativa de leitura do authToken:', cookies.authToken);

      if (!cookies.authToken) {
        navigate('/login');
      } else {
        console.log('Token encontrado após nova leitura:', cookies.authToken);
      }
    };

    // Espera 200ms e verifica novamente
    const timeout = setTimeout(checkAuthToken, 200);

    return () => clearTimeout(timeout);
  }, [cookies, navigate]);

  return (
    <div>
      <h1>Bem-vindo à página de registro!</h1>
    </div>
  );
};

export default Register;
