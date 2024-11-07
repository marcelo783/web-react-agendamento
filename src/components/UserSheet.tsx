// src/components/UserSheet.tsx
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode"; // Importa jwt-decode para decodificar o token
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { FaTriangleExclamation } from "react-icons/fa6";
import { RocketIcon } from "lucide-react";
import { ToastAction } from "./ui/toast";




export function UserSheet() {
  const [open, setOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    "authToken",
    "accessToken",
  ]);
  //const [cookies] = useCookies(["authToken"]); // Acessa o cookie com o token JWT
  const [userInfo, setUserInfo] = useState({ firstName: "", picture: "" }); // Estado para armazenar informações do usuário

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    especialidade: "",
    registroProfissional: "",
    userName: "",
  });

  // Decodifica o token JWT para obter as informações do usuário
  useEffect(() => {
    if (cookies.authToken) {
      const decodedToken = jwtDecode(cookies.authToken);
      setUserInfo({
        firstName: decodedToken.firstName,
        picture: decodedToken.picture,
      });
    }
  }, [cookies.authToken]);

  useEffect(() => {
    if (cookies.authToken) {
      const tokenPayload = jwtDecode(cookies.authToken);
      const psicologoId = tokenPayload.sub;

      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/psicologos/${psicologoId}`,
            {
              headers: {
                Authorization: `Bearer ${cookies.authToken}`,
              },
            }
          );
          setFormData(response.data); // Preenche o formulário com os dados do psicólogo
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
        }
      };

      fetchUserData();
    }
  }, [cookies.authToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    const _id = JSON.parse(atob(cookies.authToken.split(".")[1])).sub;

    try {
      await axios.patch(
        `http://localhost:5000/psicologos/${_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.authToken}`,
          },
        }
      );
      
      toast({
        
        title: "Usuário editado com sucesso! !",
        description: "Usuário foi editado.",
       
        //status: "success",
      });
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      toast({
        variant: "destructive",
        title: "Erro ao editar",
        description: "Não foi possível editar Usuário.",
        
        //action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  };

  const handleLogout = () => {
    // Remove os cookies
    removeCookie("authToken", { path: "/" });
    removeCookie("accessToken", { path: "/" });

    // Redireciona para a página de  ou home
    window.location.href = "/home";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <FaUserCircle
          size={25}
          className="text-white cursor-pointer fixed right-4"
        />
      </SheetTrigger>
      <SheetContent side="right" className="p-4">
        {" "}
        {/* Reduzi o padding */}
        <SheetHeader className="flex items-center gap-4 justify-between  space-x-4">
          <div className="flex items-center gap-6">
            <img
              src={userInfo.picture}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <SheetTitle className="text-lg">{userInfo.firstName}</SheetTitle>{" "}
            {/* Exibe o nome do usuário */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="ml-4 p-2"
            >
              <FaSignOutAlt size={20} />
            </Button>
          </div>
        </SheetHeader>
        <Card className="w-full max-w-lg mt-4">
          {" "}
          <CardHeader>
            <CardTitle className="text-center text-base">
              Editar Informações
            </CardTitle>{" "}
          </CardHeader>
          <CardContent>
            <form className="space-y-3">
              {" "}
              {/* Reduzi o espaçamento vertical */}
              <div>
                <Label htmlFor="nome" className="text-sm">
                  Nome
                </Label>{" "}
                {/* Menor fonte */}
                <Input
                  id="nome"
                  type="text"
                  name="nome"
                  className="text-sm py-1"
                  required
                  value={formData.nome}
                  onChange={handleInputChange}
                />{" "}
                {/* Input mais compacto */}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {" "}
                {/* Menor espaçamento */}
                <div>
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    className="text-sm py-1"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="senha" className="text-sm">
                    Senha
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    name="senha"
                    className="text-sm py-1"
                    required
                    value={formData.senha}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="especialidade" className="text-sm">
                    Especialidade
                  </Label>
                  <Input
                    id="especialidade"
                    type="text"
                    name="especialidade"
                    className="text-sm py-1"
                    required
                    value={formData.especialidade}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="telefone" className="text-sm">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    name="telefone"
                    className="text-sm py-1"
                    required
                    value={formData.telefone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="userName" className="text-sm">
                    Nome de Usuário
                  </Label>
                  <Input
                    id="userName"
                    type="text"
                    name="userName"
                    className="text-sm py-1"
                    required
                    value={formData.userName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="registroProfissional" className="text-sm">
                    CPI
                  </Label>
                  <Input
                    id="registroProfissional"
                    type="text"
                    name="registroProfissional"
                    className="text-sm py-1"
                    required
                    value={formData.registroProfissional}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Button
                onClick={handleSave}
                className="w-full bg-blue-500 hover:bg-blue-800"
                type="button"
              >
                Salvar
              </Button>
            </form>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );
}
