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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { format } from "date-fns";
import { FaTrashAlt } from "react-icons/fa";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/MainLayout";

type Disponibilidade = {
  dia: Date | string;
  horarios: {
    _id: string;
    inicio: string;
    fim: string;
    status: string;
    duracao: number;
    paciente: string | null; // Novo campo adicionado
  }[];
};

type FormDataType = {
  _id?: string;
  agendamentoId?: string;
  titulo: string;
  descricao: string;
  pacienteEmail: string;
  formatoConsulta: string;
  valor: string;
  repete: boolean;
  disponibilidade: Disponibilidade[];
};

const EditEvent = () => {
  const { googleCalendarId, _id } = useParams(); // Captura o googleCalendarId da URL
  // Captura o googleCalendarId da UR
  const navigate = useNavigate();
  const [cookies] = useCookies(["accessToken", "authToken"]); // Acessa o accessToken dos cookies
  const [formData, setFormData] = useState<FormDataType>({
    titulo: "",
    descricao: "",
    pacienteEmail: "",
    formatoConsulta: "",
    valor: "",
    repete: false,
    disponibilidade: [
      {
        dia: new Date(), 
        horarios: [
          {
            _id: "",
            inicio: "",
            fim: "",
            duracao: 1,
            status: "",
            paciente: null, // Valor inicial padrão
          },
        ],
      },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Função para adicionar um novo horário
  const handleAddHorario = (dispIndex: any) => {
    const updatedDisponibilidade = [...formData.disponibilidade];
    updatedDisponibilidade[dispIndex].horarios.push({
      _id: '',
      inicio: "",
      fim: "",
      duracao: 0,
      status: "disponivel",
      paciente: null,
    });
    setFormData({ ...formData, disponibilidade: updatedDisponibilidade });
  };

  // Função para remover um horário
  const handleRemoveHorario = (dispIndex: any, horarioIndex: any) => {
    const updatedDisponibilidade = [...formData.disponibilidade];
    updatedDisponibilidade[dispIndex].horarios.splice(horarioIndex, 1);
    setFormData({ ...formData, disponibilidade: updatedDisponibilidade });
  };

  const handleHorarioChange = (e: any, dispIndex: any, horarioIndex: any) => {
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
  const calculateDuration = (inicio: string, fim: string) => {
    const [startHour, startMinute] = inicio.split(":").map(Number);
    const [endHour, endMinute] = fim.split(":").map(Number);

    const startTime = new Date(0, 0, 0, startHour, startMinute).getTime();
    const endTime = new Date(0, 0, 0, endHour, endMinute).getTime();

    const duration = (endTime - startTime) / 60000; // Duração em minutos
    return duration > 0 ? duration : 1; // Retorna 1 como valor mínimo
  };

  // Função para remover uma data
  const handleRemoveDisponibilidade = (dispIndex: any) => {
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
          dia: new Date().toISOString().split("T")[0], // Data no formato esperado
          horarios: [
            {
              _id: "",
              inicio: "",
              fim: "",
              duracao: 1,
              status: "disponivel",
              paciente: null,
            },
          ],
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
          _id: response.data._id || "",
          agendamentoId: formData.agendamentoId || "",
          titulo: response.data.titulo || "",
          descricao: response.data.descricao || "",
          pacienteEmail: response.data.pacienteEmail || "",
          formatoConsulta: response.data.formatoConsulta || "",
          valor: response.data.valor ? String(response.data.valor) : "",
          repete: response.data.repete || false,
          disponibilidade: response.data.disponibilidade.map((disp: any) => ({
            dia: disp.dia,
            horarios: disp.horarios.map((horario: any) => ({
              _id: horario._id,
              inicio: horario.inicio,
              fim: horario.fim,
              duracao: horario.duracao,
              status: horario.status || "disponivel",
              paciente: horario.paciente || null,
            })),
          })),
        });
      } catch (error) {
        console.error("Erro ao buscar o agendamento", error);
      }
    };

    fetchEventData();
  }, [googleCalendarId, _id]);

  // Função para salvar os dados atualizados
  const handleSave = async (e: any) => {
    e.preventDefault();

    const token = cookies.accessToken; // Token do Google
    const authToken = cookies.authToken; // Token JWT

    if (!authToken) {
      console.error("Token JWT não encontrado.");
      return;
    }

    try {
      // Formatar a disponibilidade
      const formattedDisponibilidade = formData.disponibilidade.map((disp) => ({
        dia:
          typeof disp.dia === "string"
            ? disp.dia.split("T")[0] // Remove a hora, mantendo apenas a data
            : disp.dia instanceof Date
            ? disp.dia.toISOString().split("T")[0]
            : disp.dia, // Certifique-se de que sempre esteja no formato `YYYY-MM-DD`
        horarios: disp.horarios.map((horario) => ({
          _id: horario._id,
          inicio: horario.inicio,
          fim: horario.fim,
          duracao: horario.duracao,
          status: horario.status || "disponivel",
          paciente: horario.paciente ?? null,
        })),
      }));
      

      // Payload final
      const updatedData = {
        ...formData,
        disponibilidade: formattedDisponibilidade,
      };

      // Atualizar ambos ao mesmo tempo (Google Calendar + Back-End)
      await axios.put(
        `http://localhost:5000/calendar/event/${_id}`, // Usar o `_id` do evento
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token Google para eventos
            "x-auth-token": authToken, // Token JWT para autenticação adicional
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Agendamento editado com sucesso",
        description:
          "O agendamento foi atualizado no Google Calendar e Back-End.",
      });

      navigate("/adm"); // Redireciona para a página de administração
    } catch (error) {
      console.error("Erro ao atualizar o agendamento", error);
      toast({
        variant: "destructive",
        title: "Erro ao editar",
        description: "Não foi possível atualizar o agendamento.",
      });
    }
  };

  return (
    <MainLayout>
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
                {googleCalendarId && (
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
                )}
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

              {/* Status */}
              {/* {formData.disponibilidade.map((disp, dispIndex) => (
                <div key={dispIndex}>
                
                  {disp.horarios.map((horario, horarioIndex) => (
                    <div key={horarioIndex}>
                      <Select
                        value={horario.status} // Acessa o status do horário específico
                        onValueChange={(value) =>
                          setFormData((prev) => {
                            const updatedDisponibilidade = [
                              ...prev.disponibilidade,
                            ];
                            updatedDisponibilidade[dispIndex].horarios[
                              horarioIndex
                            ].status = value;
                            return {
                              ...prev,
                              disponibilidade: updatedDisponibilidade,
                            };
                          })
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disponivel">Disponível</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                          <SelectItem value="ausente">Ausente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              ))}  */}

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
                            ? format(new Date(disp.dia), "PPP", {
                                locale: ptBR,
                              })
                            : "Escolha a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={new Date(disp.dia)}
                          onSelect={(date) => {
                            if (date) {
                              // Verifica se `date` não é `undefined`
                              const updatedDisponibilidade = [
                                ...formData.disponibilidade,
                              ];
                              updatedDisponibilidade[index].dia = date;
                              setFormData({
                                ...formData,
                                disponibilidade: updatedDisponibilidade,
                              });
                            }
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
    </MainLayout>
  );
};

export default EditEvent;
