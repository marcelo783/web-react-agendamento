
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [cookies] = useCookies(['authToken']);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.authToken) {
      // Redireciona para o login se o token não existir
      navigate('/login');
    }///else {
      console.log('Token encontrado:', cookies.authToken);
   // }
  }, [cookies, navigate]);

  return (
    <div>
      <h1>Bem-vindo à página de registro!</h1>
      {/* Conteúdo da página de registro */}
    </div>
  );
};

export default Register;
