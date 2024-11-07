import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/MainLayout";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const [cookies] = useCookies(['authToken']);
  const navigate = useNavigate();

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    especialidade: '',
    registroProfissional: '',
    userName: '',
  });

  useEffect(() => {
    const checkAuthToken = () => {
      console.log('Tentativa de leitura do authToken:', cookies.authToken);

      if (!cookies.authToken) {
        navigate('/login');  // Redireciona para login se não houver token
      } else {
        console.log('Token encontrado após nova leitura:', cookies.authToken);
      }
    };

    // Verifica imediatamente
    checkAuthToken();

    // Define um timeout para a verificação futura, se necessário
    const timeout = setTimeout(checkAuthToken, 200);

    return () => clearTimeout(timeout);
  }, [cookies, navigate]);


  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

//   const handleCheckboxChange = (checked:any, name:any) => {
//   setFormData((prevState) => ({
//     ...prevState,
//     [name]: checked,
//   }));
// };


  // Função de submissão do formulário
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/psicologos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.authToken}`, // Enviando o token JWT
        },
        body: JSON.stringify(formData),
      });

      toast({
        title: "Psicólogo criado com sucesso",
        description: "O Psicólogo foi criado com sucesso.",
        //status: "success",
      });

      if (response.ok) {
        setTimeout(() => {
        navigate('/adm');
      }, 2000); // 2000 mil
      } else {
        // Tratar o caso de erro
        console.error('Erro ao registrar:', response.statusText);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar",
        description: "Não foi possível registrar-se!.",
        //action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  };



  return (
    <MainLayout>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center">Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" type="text" name="nome" onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" type="password" name="senha" onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input id="especialidade" type="text" name="especialidade" onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" type="tel" name="telefone" onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userName">Nome de Usuário</Label>
                <Input id="userName" type="text" name="userName" onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="registroProfissional">Registro Profissional</Label>
                <Input id="registroProfissional" type="text" name="registroProfissional" onChange={handleChange} required />
              </div>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-800" type="submit">
              Registrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </MainLayout>
  );
};

export default Register;
