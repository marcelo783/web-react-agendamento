import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ptBR } from "date-fns/locale";
import accessToken from "@/cookies/appAccessToken";
import { format } from "date-fns";
import { FaTrashAlt } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";

const EditEvent = () => {
  const { googleCalendarId, _id } = useParams();  // Captura o googleCalendarId da URL
  // Captura o googleCalendarId da URL
 

  const navigate = useNavigate();
  const [cookies] = useCookies(["accessToken", "authToken"]); // Acessa o accessToken dos cookies

  const [formData, setFormData] = useState({
    _id: "",
    agendamentoId: "", // Armazena o agendamentoId do backend
    titulo: "",
    descricao: "",
    pacienteEmail: "",
    formatoConsulta: "online",
    valor: "",
    disponibilidade: [
      { dia: null, horarios: [{ inicio: "", fim: "", duracao: 0 }] },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // atualiza o valor do campo com o nome correspondente
    });
  };
  // Função para adicionar um novo horário
  const handleAddHorario = (dispIndex) => {
    const updatedDisponibilidade = [...formData.disponibilidade];
    updatedDisponibilidade[dispIndex].horarios.push({
      inicio: "",
      fim: "",
      duracao: 0,
    });
    setFormData({ ...formData, disponibilidade: updatedDisponibilidade });
  };

  // Função para remover um horário
  const handleRemoveHorario = (dispIndex, horarioIndex) => {
    const updatedDisponibilidade = [...formData.disponibilidade];
    updatedDisponibilidade[dispIndex].horarios.splice(horarioIndex, 1);
    setFormData({ ...formData, disponibilidade: updatedDisponibilidade });
  };


  const handleHorarioChange = (e, dispIndex, horarioIndex) => {
    const { name, value } = e.target;
    const updatedHorarios = formData.disponibilidade[dispIndex].horarios.map(
      (horario, i) => {
        if (i === horarioIndex) {
          const updatedHorario = { ...horario, [name]: value };
          if (updatedHorario.inicio && updatedHorario.fim) {
            updatedHorario.duracao = calculateDuration(
              updatedHorario.inicio,
              updatedHorario.fim
            );
          }
          return updatedHorario;
        }
        return horario;
      }
    );

    const updatedDisponibilidade = formData.disponibilidade.map((disp, i) =>
      i === dispIndex ? { ...disp, horarios: updatedHorarios } : disp
    );

    setFormData((prevState) => ({
      ...prevState,
      disponibilidade: updatedDisponibilidade,
    }));
  };
  

  // Função para calcular a duração automaticamente
  const calculateDuration = (inicio, fim) => {
    const [startHour, startMinute] = inicio.split(":");
    const [endHour, endMinute] = fim.split(":");

    const startDate = new Date();
    const endDate = new Date();

    startDate.setHours(startHour, startMinute);
    endDate.setHours(endHour, endMinute);

    const duration = (endDate - startDate) / (1000 * 60); // Calcula a diferença em minutos
    return duration > 0 ? duration : 0; // Retorna a duração ou 0 se o valor for negativo
  };


  // Função para remover uma data
  const handleRemoveDisponibilidade = (dispIndex) => {
    const updatedDisponibilidade = [...formData.disponibilidade];
    updatedDisponibilidade.splice(dispIndex, 1);
    setFormData({ ...formData, disponibilidade: updatedDisponibilidade });
  };


  const handleAddDisponibilidade = () => {
    setFormData((prevState) => ({
      ...prevState,
      disponibilidade: [
        ...prevState.disponibilidade,
        {
          dia: null,
          horarios: [{ inicio: "", fim: "", duracao: 1 }],
        },
      ],
    }));
  };


  // Função para buscar os dados do evento (incluindo agendamentoId) ao carregar a página
  
 
  useEffect(() => {
    console.log("googleCalendarId:", googleCalendarId);
  console.log("_id:", _id);
    const fetchEventData = async () => {
      try {
        let response;
  
        if (googleCalendarId && googleCalendarId !== "undefined") {
          // Buscar agendamento pelo googleCalendarId
          response = await axios.get(
            `http://localhost:5000/agendamentos/googleCalendar/${googleCalendarId}`,
            { withCredentials: true }
          );
        } else if (_id && _id !== "undefined") {
          // Buscar agendamento pelo _id
          response = await axios.get(
            `http://localhost:5000/agendamentos/${_id}`,
            { withCredentials: true }
          );
        } else {
          console.error("Nenhum ID válido do evento fornecido.");
          return;
        }
  
        // Atualizar o estado do formulário com os dados obtidos
        setFormData({
          _id: response.data._id, 
          titulo: response.data.titulo,
          descricao: response.data.descricao,
          pacienteEmail: response.data.pacienteEmail || "",
          formatoConsulta: response.data.formatoConsulta,
          valor: response.data.valor,
          disponibilidade: response.data.disponibilidade,
        });
      } catch (error) {
        console.error("Erro ao buscar o agendamento", error);
      }
    };
  
    fetchEventData();
  }, [googleCalendarId, _id]);
  
  
  
  
  

  
  // Função para salvar os dados atualizados
  const handleSave = async (e) => {
    e.preventDefault();
  
    const token = cookies.accessToken;
    const authToken = cookies.authToken;
  
    if (!authToken) {
      console.error("Token JWT não encontrado.");
      return;
    }
  
    try {
      const formattedDisponibilidade = formData.disponibilidade.map((disp) => {
        const diaFormatted = disp.dia instanceof Date 
          ? disp.dia.toISOString().split('T')[0]  // Se for Date, formatar para YYYY-MM-DD
          : disp.dia;  // Se já estiver no formato correto, apenas usar
  
        const horarios = disp.horarios.map((horario) => ({
          inicio: horario.inicio,
          fim: horario.fim,
          duracao: horario.duracao,
        }));
  
        return {
          dia: diaFormatted,
          horarios,
        };
      });
  
      const updatedData = {
        ...formData,
        disponibilidade: formattedDisponibilidade,
      };
  
      if (googleCalendarId && googleCalendarId !== "undefined") {
        // Atualizar evento no Google Calendar e backend
        await axios.put(
          `http://localhost:5000/calendar/event/${googleCalendarId}`,
          updatedData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (_id && _id !== "undefined") {
        // Atualizar apenas no backend usando _id
        await axios.patch(
          `http://localhost:5000/agendamentos/${_id}`,
          updatedData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      }
  
      toast({
        title: "Agendamento editado com sucesso",
        description: "O agendamento foi editado com sucesso.",
        status: "success",
      });
  
      navigate("/adm");
    } catch (error) {
      console.error("Erro ao atualizar o agendamento", error);
    }
  };
  
  
  

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Editar Agendamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Título */}
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                onChange={handleInputChange}
                value={formData.descricao}
                required
              />
            </div>
            {/* E-mail do paciente */}
            <div>
              <Label htmlFor="pacienteEmail">E-mail do Paciente</Label>
              <Input
                id="pacienteEmail"
                name="pacienteEmail"
                type="email"
                value={formData.pacienteEmail}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Formato da Consulta */}
            <div>
              <Label>Formato da Consulta</Label>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    name="formatoConsulta"
                    value="online"
                    checked={formData.formatoConsulta === "online"}
                    onChange={handleInputChange}
                  />{" "}
                  Online
                </label>
                <label>
                  <input
                    type="radio"
                    name="formatoConsulta"
                    value="presencial"
                    checked={formData.formatoConsulta === "presencial"}
                    onChange={handleInputChange}
                  />{" "}
                  Presencial
                </label>
              </div>
            </div>

            {/* Valor */}
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Disponibilidade */}
            {formData.disponibilidade.map((disp, index) => (
              <div key={index} className="space-y-4 border-b pb-4 mb-4">
                <div>
                  <Label htmlFor={`dia-${index}`}>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {disp.dia
                          ? format(new Date(disp.dia), "PPP", { locale: ptBR })
                          : "Escolha a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(disp.dia)}
                        onSelect={(date) => {
                          const updatedDisponibilidade = [
                            ...formData.disponibilidade,
                          ];
                          updatedDisponibilidade[index].dia = date;
                          setFormData({
                            ...formData,
                            disponibilidade: updatedDisponibilidade,
                          });
                        }}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Horários */}
                <div className="space-y-4">
                  <Label>Horários Disponíveis</Label>
                  {disp.horarios.map((horario, horarioIndex) => (
                    <div
                      key={horarioIndex}
                      className="grid grid-cols-4 gap-4 items-center"
                    >
                      <div>
                        <Label htmlFor={`inicio-${index}-${horarioIndex}`}>
                          Início
                        </Label>
                        <Input
                          id={`inicio-${index}-${horarioIndex}`}
                          name="inicio"
                          type="time"
                          value={horario.inicio}
                          onChange={(e) =>
                            handleHorarioChange(e, index, horarioIndex)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`fim-${index}-${horarioIndex}`}>
                          Fim
                        </Label>
                        <Input
                          id={`fim-${index}-${horarioIndex}`}
                          name="fim"
                          type="time"
                          value={horario.fim}
                          onChange={(e) =>
                            handleHorarioChange(e, index, horarioIndex)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`duracao-${index}-${horarioIndex}`}>
                          Duração (min)
                        </Label>
                        <Input
                          id={`duracao-${index}-${horarioIndex}`}
                          name="duracao"
                          type="number"
                          value={horario.duracao}
                          onChange={(e) =>
                            handleHorarioChange(e, index, horarioIndex)
                          }
                          readOnly // Somente leitura
                        />
                      </div>
                      <div className="flex justify-center items-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveHorario(index, horarioIndex)
                          }
                          className="p-2 hover:bg-red-100 rounded-md text-red-600"
                        >
                          <FaTrashAlt className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => handleAddHorario(index)}
                  >
                    Adicionar Horário
                  </Button>
                </div>

                <div className="flex justify-end mt-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveDisponibilidade(index)}
                  >
                    Remover Data
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="mt-4"
              onClick={handleAddDisponibilidade}
            >
              Adicionar Data
            </Button>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-700"
            >
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditEvent;
