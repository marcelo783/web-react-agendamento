import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiEdit, FiTrash } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { BsPersonWorkspace } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Interfaces para os tipos
interface Horario {
  _id: string;
  status: string;
  paciente: string | null;
  inicio: string;
  fim: string;
  duracao: number;
}

interface Disponibilidade {
  dia: string;
  horarios: Horario[];
}

interface CardAdmProps {
  _id: string;
  googleCalendarId: string;
  titulo: string;
  descricao: string;
  paciente: string;
  pacientes: { [key: string]: string }; // Mapeamento de IDs para nomes
  formatoConsulta: string;
  status: string;
  data: string;
  inicio: string;
  fim: string;
  duracao: number | string;
  valor: number;

  disponibilidade: Disponibilidade[];
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
  pacientes,
  formatoConsulta,
  status,
  data,
  inicio,
  fim,
  duracao,
  valor,
 
  disponibilidade,
}) => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["accessToken", "authToken"]);

  const borderColor = getBorderColor(status);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const { toast } = useToast();

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
        await axios.delete(
          `http://localhost:5000/calendar/event/${googleCalendarId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
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
     

      {/* Conteúdo do card */}
      <h2 className="text-lg font-semibold text-center mt-4 mb-2">{titulo}</h2>
      <ScrollArea className="h-16 mb-2 p-2 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-700">{descricao}</p>
      </ScrollArea>
      {/* <p className="text-sm text-gray-800 mb-2">
        <strong>Paciente:</strong> {paciente || "Nenhum paciente"}
      </p> */}
      <div className="flex justify-between items-center text-sm text-gray-800 mb-2">
        <div className="flex items-center">
          <BsPersonWorkspace className="mr-2" />
          <span>{formatoConsulta}</span>
        </div>
        <div className="text-gray-800">
          <span>{status}</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-800 mb-2">
        <div className="flex items-center">
          <AiOutlineCalendar className="mr-2" />
          <span>{data}</span>
        </div>
        <div className="text-gray-800">
          <span>R$</span> {valor.toFixed(2)}
        </div>
      </div>

      {/* Dropdown Menu de configurações */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-2 right-2 text-gray-400">
            <FaCog />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 modal={false}">
          <DropdownMenuItem
            className="flex items-center space-x-2"
            onClick={handleEditClick}
          >
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

      {/* Botão Ver Disponibilidade */}

      <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <div className="flex justify-center items-center">
      <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
        Ver Disponibilidade
      </button>
    </div>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="start" className="w-96 p-4">
    <ScrollArea className="h-96 scroll-smooth">
      {disponibilidade && disponibilidade.length > 0 ? (
        disponibilidade.map((dia: Disponibilidade) => (
          <div key={dia.dia} className="mb-4">
            {/* Data do dia */}
            <p className="font-semibold text-gray-800 mb-2">
              {new Date(dia.dia).toLocaleDateString("pt-BR")}
            </p>
            {dia.horarios.map((horario: Horario) => {
              const borderColor = getBorderColor(
                horario.status ? "agendado" : "disponivel"
              ); // Define a cor com base no status

              return (
                <div
                  key={horario._id}
                  className={`p-4 mb-3 border-2 rounded-md shadow-sm bg-white ${borderColor}`}
                >
                  <div className="flex justify-between items-center">
                    {/* Horário */}
                    <span className="text-sm font-medium text-gray-800">
                      {horario.inicio} até {horario.fim}
                    </span>

                    {/* Select */}
                    <Select
                      defaultValue={
                        horario.status ? "agendado" : "disponivel"
                      }
                      onValueChange={(value) => console.log("Novo status:", value)} // Substitua pelo handler necessário
                    >
                      <SelectTrigger className="w-[100px] h-[28px] text-xs bg-white border border-red-300 rounded-md shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponivel">Disponível</SelectItem>
                        <SelectItem value="agendado">Agendado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nome do paciente ou status disponível e duração */}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm font-semibold text-gray-700">
                    {horario.paciente ? pacientes[horario.paciente] || "Carregando..." : "Disponível"}
                    </p>
                    <p className="text-sm font-medium text-gray-500">
                      {horario.duracao}m
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">Sem disponibilidade</p>
      )}
    </ScrollArea>
  </DropdownMenuContent>
      </DropdownMenu>



    </div>
  );
};

export default CardAdm;
