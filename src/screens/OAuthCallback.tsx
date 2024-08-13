import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Cookie:', document.cookie);
    // Verifica se o cookie 'authToken' está presente
    const token = document.cookie.includes('authToken');
    if (token) {
      navigate('/register'); // Redireciona para a página de registro
    } else {
      navigate('/login'); // Redireciona para login se o token não estiver presente
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p>Logging in...</p>
    </div>
  );
};

export default OAuthCallback;
