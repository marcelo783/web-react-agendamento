import React, { useEffect, useState } from 'react';
import Input from '@/components/ui/input';
import {  useNavigate } from 'react-router-dom';


const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
    professionalRegistry: '',
    userName: ''
  });

  const navigate = useNavigate();

  // Verificar se o token está presente no cookie
  useEffect(() => {
    const token = '';
    if (!token) {
      navigate('/login'); // Redireciona para login se o token não estiver presente
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Integração com o backend para registrar o psicólogo
    try {
      const response = await fetch('http://localhost:5000/psicologos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${''}` // Inclui o token de autenticação
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Erro ao registrar psicólogo');
      }
      const result = await response.json();
      console.log(result);
      navigate('/adm');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nome" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Senha" type="password" name="password" value={formData.password} onChange={handleChange} />
            
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Especialidade" type="text" name="specialty" value={formData.specialty} onChange={handleChange} />
          <Input label="Telefone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nome de Usuário" type="text" name="userName" value={formData.userName} onChange={handleChange} />
          <Input label="Registro Profissional" type="text" name="professionalRegistry" value={formData.professionalRegistry} onChange={handleChange} />
          </div>
          
          
          
          <button
            className="bg-blue-500 text-white  hover:bg-blue-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
