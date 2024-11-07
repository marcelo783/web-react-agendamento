import React, { useState } from "react";
import { FaCog } from "react-icons/fa"; // Ícone de engrenagem
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai"; // Ícones de calendário e relógio
import { ScrollArea } from "@/components/ui/scroll-area"; // Importando o Scroll-area do Shadcn
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Dropdown do Shadcn
import { FiEdit, FiTrash } from "react-icons/fi"; // Ícones de lápis e lixeira
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import axios from "axios";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"; // AlertDialog do Shadcn
import { useToast } from "@/hooks/use-toast"



interface CardAdmProps {
  _id: string;
  googleCalendarId: string;
  titulo: string;
  descricao: string;
  paciente: string;
  formatoConsulta: string;
  status: string;
  data: string;
  inicio: string;
  fim: string;
  duracao: number;
  valor: number;
}

const getBorderColor = (status: string) => {
  switch (status) {
    case "disponivel":
      return "bg-green-500";
    case "cancelado":
      return "bg-red-500";
    case "concluido":
      return "bg-yellow-500";
    case "expirado":
      return "bg-purple-500";
    case "agendado":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const CardAdm: React.FC<CardAdmProps> = ({
  _id,
  googleCalendarId,
  titulo,
  descricao,
  paciente,
  formatoConsulta,
  status,
  data,
  inicio,
  fim,
  duracao,
  valor,
}) => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['accessToken', 'authToken']);
  
  const borderColor = getBorderColor(status);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const { toast } = useToast()

  const handleEditClick = () => {
    if (googleCalendarId && googleCalendarId !== "undefined") {
      navigate(`/edit-event/${googleCalendarId}`);
    } else if (_id && _id !== "undefined") {
      navigate(`/edit-event-id/${_id}`);
    } else {
      console.error("Nenhum ID válido para editar o evento.");
    }
  };
  
  
  
  
  
  

  const handleDeleteClick = async () => {
    try {
      
      const token = cookies.authToken;
      const accessToken = cookies.accessToken;
      if (!token) {
        console.error("AuthToken não encontrado.");
        return;
      }
  
      if (googleCalendarId) {
        // Deletar evento no Google Calendar
        await axios.delete(`http://localhost:5000/calendar/event/${googleCalendarId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        //  deletar somente no backend 
        await axios.delete(`http://localhost:5000/agendamentos/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
  
      // Mostrar Toast de sucesso
      toast({
        title: "Agendamento deletado",
        description: "O agendamento foi deletado com sucesso.",
        //status: "success",
      });
  
      console.log("Agendamento deletado com sucesso");
      // Aqui você poderia remover o card da interface, caso necessário.
    } catch (error) {
      console.error("Erro ao deletar o agendamento", error);
    } finally {
      setIsAlertDialogOpen(false); // Fechar o AlertDialog após tentativa de deletar
    }
  };
  

  return (
    <div className="relative p-4 border rounded shadow-md w-88">
      {/* Linha colorida na parte superior do card */}
      <div className={`w-full h-1 ${borderColor} absolute top-0 left-0 rounded-t`} />

      {/* Dropdown Menu de configurações */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-2 right-2 text-gray-400">
            <FaCog />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 modal={false}">
          <DropdownMenuItem className="flex items-center space-x-2" onClick={handleEditClick}>
            <FiEdit className="text-gray-600" />
            <span>Editar</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center space-x-2 text-red-600"
            onClick={() => setIsAlertDialogOpen(true)}
          >
            <FiTrash className="text-red-600" />
            <span>Excluir</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AlertDialog para confirmar exclusão */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogTrigger asChild>
          <div />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <p className="font-semibold">Confirmar Exclusão</p>
            <p>Você realmente deseja apagar o agendamento?</p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
              Não
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClick}>
              Sim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Conteúdo do card */}
      <h2 className="text-lg font-semibold text-center mt-4 mb-2">{titulo}</h2>
      <ScrollArea className="h-16 mb-2 p-2 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-700">{descricao}</p>
      </ScrollArea>
      <p className="text-sm text-gray-800 mb-2">
        <strong>Paciente:</strong> {paciente}
      </p>
      <div className="flex justify-between items-center text-sm text-gray-800 mb-2">
        <span>{formatoConsulta}</span>
        <span>{status}</span>
      </div>

      {/* Data e valor lado a lado */}
      <div className="flex justify-between items-center text-sm text-gray-800 mb-2">
        <div className="flex items-center">
          <AiOutlineCalendar className="mr-2" />
          <span>{data}</span>
        </div>
        <div className="text-gray-800">
          <span>R$</span> {valor.toFixed(2)}
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-800">
        <AiOutlineClockCircle className="mr-2" />
        <span>
          <strong>Início:</strong> {inicio} <strong>Fim:</strong> {fim}{" "}
          <strong>Duração:</strong> {duracao}m
        </span>
      </div>
    </div>
  );
};

export default CardAdm;
