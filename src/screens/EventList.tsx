import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ptBR } from "date-fns/locale";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie"
import { ScrollArea } from "@/components/ui/scroll-area";
import ErroImg from "../assets/person-calendar.png";
import Header from "@/components/Header";
import MainLayout from "@/components/MainLayout";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type Disponibilidade = {
  dia: string; // ou Date, dependendo do seu modelo de dados
  horarios: {
    _id: string; // Adicionado para capturar o `horarioId`
    inicio: string;
    fim: string;
    duracao: number;
    status: string;
    paciente: string | null;
  }[];
};

type Event = {
  _id: string;
  titulo: string;
  descricao: string;
  formatoConsulta: string;
  valor: number;
  disponibilidade: Disponibilidade[];
};

type FormDataType = {
  nome: string;
  email: string;
  telefone: string;
  agendamentoId: string;
  horarioId: string; // Adicionado para enviar o ID do horário selecionado
};

const EventList = () => {
  const [cookies] = useCookies(["accessToken", "refreshToken"]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<
    {
      _id: string;
      inicio: string;
      fim: string;
      status: string;
      duracao: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [, setIsDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataType>({
    nome: "",
    email: "",
    telefone: "",
    agendamentoId: "",
    horarioId: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/agendamentos");
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erro ao buscar eventos.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Função para retornar os dias de disponibilidade
  const getAvailableDays = () => {
    // Usamos flatMap para "achatar" os arrays aninhados
    const availableDays: Date[] = events.flatMap((event) =>
      event.disponibilidade.map(
        (disponibilidade) => new Date(disponibilidade.dia)
      )
    );

    return availableDays;
  };

  const handleDateSelect = (date: any) => {
    setSelectedDate(date);

    // Encontrar o evento que possui a disponibilidade correspondente à data selecionada
    const event = events.find((event) =>
      event.disponibilidade.some(
        (disponibilidade) =>
          format(new Date(disponibilidade.dia), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      )
    );

    if (event) {
      setSelectedEvent(event); // Definir o evento selecionado
      const disponibilidade = event.disponibilidade.find(
        (disponibilidade) =>
          format(new Date(disponibilidade.dia), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      );
      if (disponibilidade) {
        setAvailableTimes(disponibilidade.horarios);
        console.log("availableTimes:", disponibilidade.horarios);
      } else {
        setAvailableTimes([]);
      }
    } else {
      setAvailableTimes([]);
      setSelectedEvent(null);
    }
  };

  const handleOpenDialog = (agendamentoId: string, horarioId: string) => {
    if (!selectedEvent) {
      console.error("Nenhum evento selecionado.");
      return;
    }
    console.log("Agendamento ID definido:", agendamentoId);
    console.log("Horário ID definido:", horarioId);

    // Atualizar o estado com os IDs de agendamento e horário
    setFormData({
      ...formData,
      agendamentoId: agendamentoId,
      horarioId: horarioId, // Adiciona o horário selecionado
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      agendamentoId: "",
      horarioId: "",
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
  
    if (!formData.nome || !formData.email || !formData.telefone) {
      console.error("❌ Todos os campos são obrigatórios.");
      return;
    }
  
    try {
      let accessToken = Cookies.get("accessToken");
  
      if (!accessToken) {
        console.log("🔄 Access token ausente. Tentando renovar usando refresh token...");
  
        try {
          const refreshResponse = await axios.post(
            "http://localhost:5000/auth/refresh",
            {},
            { withCredentials: true }
          );
  
          console.log("✅ Novo accessToken recebido:", refreshResponse.data.accessToken);
  
          Cookies.set("accessToken", refreshResponse.data.accessToken, { expires: 0.5 });
  
          accessToken = refreshResponse.data.accessToken;
        } catch (refreshError) {
          console.error("❌ Erro ao renovar accessToken:", refreshError);
          alert("Sua sessão expirou. Faça login novamente.");
          window.location.href = "/login";
          return;
        }
      }
  
      if (!accessToken) {
        throw new Error("❌ Nenhum accessToken disponível para agendar.");
      }
  
      const response = await axios.patch(
        "http://localhost:5000/agendamentos/agendar",
        {
          pacienteNome: formData.nome,
          pacienteEmail: formData.email,
          pacienteTelefone: formData.telefone,
          agendamentoId: formData.agendamentoId,
          horarioId: formData.horarioId,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
  
      console.log("✅ Resposta do servidor:", response.data);
  
      handleCloseDialog();
  
      toast({
        title: "Agendamento criado com sucesso!",
        description: "O agendamento foi criado com sucesso.",
      });
    } catch (error: any) {
      console.error("❌ Erro geral:", error.message || error);
      toast({
        variant: "destructive",
        title: "Erro ao Agendar",
        description: error.message || "Não foi possível fazer o agendamento!",
      });
    }
  };
  
  

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        {/* Texto no topo */}
        <p className="text-lg font-semibold text-center mb-6">
          Buscando datas disponíveis...
        </p>

        {/* Grid dos cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 border rounded-lg shadow-md">
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Card 2 */}
          <div className="p-6 border rounded-lg shadow-md">
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Card 3 */}
          <div className="p-6 border rounded-lg shadow-md">
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
        {/* Imagem de erro */}
        <img
          src={ErroImg} // Substitua pela URL da imagem de erro
          alt="Error illustration"
          className="w-64 h-64 mb-8" // Responsivo conforme o tamanho da tela
        />

        {/* Mensagem de erro */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          OOPS!
        </h1>
        <p className="text-base font-semibold sm:text-lg md:text-xl text-gray-600 mb-8 text-center">
          Erro ao buscar agendamentos, tente novamente mais tarde!
        </p>

        {/* Botão de voltar */}
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300"
          onClick={() => window.history.back()} // Função para voltar
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <>
      <header
        className={`p-4 fixed w-full z-20 bg-blue-600 h-10 flex items-center justify-between shadow-md `}
      >
        {/* Esquerda: SidebarTrigger e título */}
        <div className="flex items-center gap-6">
          <IoMdArrowRoundBack
            size={30}
            className="cursor-pointer"
            onClick={() => navigate("/home")}
          />
          <h1 className="text-lg font-semibold pl-11  text-white">Agenda Ki</h1>
        </div>

        {/* Direita: UserSheet para abrir o perfil */}
      </header>
      <div className="grid grid-cols-1 p-12 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded shadow-sm">
          {selectedEvent ? (
            <div>
              <h2 className="text-xl font-bold mb-2">{selectedEvent.titulo}</h2>
              <ScrollArea className="h-24 mb-2 bg-gray-100 rounded-lg">
                <p>
                  <strong>Descrição:</strong> {selectedEvent.descricao}
                </p>
              </ScrollArea>

              <p>
                <strong>Formato da Consulta:</strong>{" "}
                {selectedEvent.formatoConsulta}
              </p>
              <p>
                <strong>Valor:</strong> R$ {selectedEvent.valor.toFixed(2)}
              </p>

              {selectedEvent.disponibilidade.map((disp, dispIndex) => (
                <div key={dispIndex}>
                  <p>
                  <strong>Dia:</strong> {new Date(disp.dia).toLocaleDateString("pt-BR")}
                  </p>
                  <ul>
                    {disp.horarios.map((horario, horarioIndex) => (
                      <li key={horario._id}>
                        <strong>Horário:</strong> {horario.inicio} -{" "}
                        {horario.fim} <strong>Status:</strong> {horario.status}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>Selecione uma data para ver as informações da consulta.</p>
          )}
        </div>

        <div className="p-4 border rounded shadow-sm">
        
          <h2 className="text-xl font-semibold mb-4">
            Selecione uma Data & Hora
          </h2>
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={handleDateSelect}
            modifiers={{
              highlighted: getAvailableDays(),
            }}
            modifiersStyles={{
              highlighted: {
                backgroundColor: "#3b82f6",
                color: "white",
              },
            }}
          />
        </div>

        <div className="p-4 border rounded shadow-sm">
          {selectedDate ? (
            <div>
                
              <h2 className="text-xl font-semibold mb-4">
                Horários disponíveis para{" "}
                {format(selectedDate, "PPPP", { locale: ptBR })}
              </h2>
              <ScrollArea className="h-64">
              {availableTimes.length > 0 ? (
                <ul className="space-y-2">
                  {availableTimes.map((time, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 border rounded shadow-sm"
                    >
                      <div>
                        <p>
                          <strong>Início:</strong> {time.inicio}
                        </p>
                        <p>
                          <strong>Fim:</strong> {time.fim}
                        </p>
                        <p>
                          <strong>Duração:</strong> {time.duracao} minutos
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`px-4 py-2 rounded ${
                              time.status === "agendado"
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-700"
                            }`}
                            disabled={time.status === "agendado"}
                            onClick={
                              time.status !== "agendado"
                                ? () =>
                                    selectedEvent &&
                                    handleOpenDialog(
                                      selectedEvent._id,
                                      time._id
                                    )
                                : undefined
                            }
                          >
                            Agendar
                          </Button>
                        </DialogTrigger>
                        {selectedEvent && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Agendar Consulta</DialogTitle>
                              <DialogDescription>
                                Preencha os campos abaixo para confirmar o
                                agendamento:
                              </DialogDescription>
                            </DialogHeader>

                            <div className="mb-4">
                              <p>
                                <strong>Título:</strong> {selectedEvent.titulo}
                              </p>
                              <ScrollArea className="h-16 mb-2 bg-gray-100 rounded-lg">
                                <p>
                                  <strong>Descrição:</strong>{" "}
                                  {selectedEvent.descricao}
                                </p>
                              </ScrollArea>
                              <p>
                                <strong>Formato Consulta:</strong>{" "}
                                {selectedEvent.formatoConsulta}
                              </p>
                              <p>
                                <strong>Valor:</strong> R${" "}
                                {selectedEvent.valor.toFixed(2)}
                              </p>
                              <p>
                                <strong>Horário Selecionado:</strong>{" "}
                                {time.inicio} - {time.fim}
                              </p>{" "}
                              {/* Exiba o horário selecionado */}
                            </div>

                            <form
                              onSubmit={handleFormSubmit}
                              className="space-y-4"
                            >
                              <div>
                                <label
                                  htmlFor="nome"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Nome
                                </label>
                                <Input
                                  id="nome"
                                  name="nome"
                                  type="text"
                                  required
                                  value={formData.nome}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Email
                                </label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  required
                                  value={formData.email}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="telefone"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Telefone
                                </label>
                                <Input
                                  id="telefone"
                                  name="telefone"
                                  type="tel"
                                  required
                                  value={formData.telefone}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <Button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                              >
                                Confirmar Agendamento
                              </Button>
                            </form>
                          </DialogContent>
                        )}
                      </Dialog>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum horário disponível para a data selecionada.</p>
              )}
              </ScrollArea>
            </div>
          ) : (
            <p>Selecione uma data para ver os horários disponíveis.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default EventList;
