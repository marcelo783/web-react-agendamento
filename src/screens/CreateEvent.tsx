import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaTrashAlt } from "react-icons/fa";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import axios from "axios"; // Para fazer a requisição
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/MainLayout";

const CreateEvent = () => {
  const [cookies] = useCookies(["authToken"]); // Obtém o token JWT do cookie
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    formatoConsulta: "",
    valor: "",
    repete: false,
    disponibilidade: [
      {
        dia: new Date(),
        horarios: [
          {
            inicio: "",
            fim: "",
            duracao: 1,
          },
        ],
      },
    ],
  });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (checked: boolean, name: string) => {
    setFormData((prevState) => {
      if (name === "repete") {
        return { ...prevState, repete: checked };
      } else {
        return { ...prevState, formatoConsulta: checked ? name : "" };
      }
    });
  };

  const handleHorarioChange = (e:any, dispIndex:any, horarioIndex:any) => {
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

  const handleRemoveHorario = (dispIndex:any, horarioIndex:any) => {
    const updatedHorarios = formData.disponibilidade[dispIndex].horarios.filter(
      (_, i) => i !== horarioIndex
    );

    const updatedDisponibilidade = formData.disponibilidade.map((disp, i) =>
      i === dispIndex ? { ...disp, horarios: updatedHorarios } : disp
    );

    setFormData((prevState) => ({
      ...prevState,
      disponibilidade: updatedDisponibilidade,
    }));
  };

  const handleRemoveDisponibilidade = (dispIndex:any) => {
    const updatedDisponibilidade = formData.disponibilidade.filter(
      (_, i) => i !== dispIndex
    );

    setFormData((prevState) => ({
      ...prevState,
      disponibilidade: updatedDisponibilidade,
    }));
  };

  const calculateDuration = (inicio: string, fim: string) => {
    const [startHour, startMinute] = inicio.split(":").map(Number);
    const [endHour, endMinute] = fim.split(":").map(Number);
  
    const startTime = new Date(0, 0, 0, startHour, startMinute).getTime();
    const endTime = new Date(0, 0, 0, endHour, endMinute).getTime();
  
    const duration = (endTime - startTime) / 60000; // Duração em minutos
    return duration > 0 ? duration : 1; // Retorna 1 como valor mínimo
  };
  

  const handleAddHorario = (dispIndex:any) => {
    const updatedDisponibilidade = formData.disponibilidade.map((disp, i) =>
      i === dispIndex
        ? {
            ...disp,
            horarios: [...disp.horarios, { inicio: "", fim: "", duracao: 1 }],
          }
        : disp
    );

    setFormData((prevState) => ({
      ...prevState,
      disponibilidade: updatedDisponibilidade,
    }));
  };

  const handleAddDisponibilidade = () => {
    setFormData((prevState) => ({
      ...prevState,
      disponibilidade: [
        ...prevState.disponibilidade,
        {
          dia: new Date(),
          horarios: [{ inicio: "", fim: "", duracao: 1 }],
        },
      ],
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    // Extrai o payload do token JWT
    const token = cookies.authToken;
    const decodedToken = jwtDecode(token);
    const psicologoId = decodedToken.sub; // Obtém o ID do psicólogo do JWT

    const payload = {
      psicologo: psicologoId,
      paciente: null,
      titulo: formData.titulo,
      descricao: formData.descricao,
      formatoConsulta: formData.formatoConsulta,
      status: "disponivel",
      valor: parseFloat(formData.valor),
      repete: formData.repete,
      disponibilidade: formData.disponibilidade.map((disp) => ({
        dia: disp.dia ? disp.dia.toISOString() : null,
        horarios: disp.horarios.map((horario) => ({
          inicio: horario.inicio,
          fim: horario.fim,
          duracao: horario.duracao,
        })),
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/agendamentos",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Inclui o token JWT no header
          },
        }
      );

      toast({
        title: "Agendamento criado com sucesso",
        description: "O agendamento foi criado com sucesso.",
        //status: "success",
      });

      console.log("Agendamento criado com sucesso:", response.data);
      // Redirecionar ou realizar outra ação após o sucesso
    } catch (error) {
      console.error("Erro ao criar o agendamento:", error);
    }
  };

  return (
    <MainLayout>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">Criar agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
              <Label htmlFor="titulo">Titulo</Label>
              <Input
                id="titulo"
                name="titulo"
                type="text"
                onChange={handleInputChange}
                value={formData.titulo}
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

            {/* Formato da Consulta */}
            <div className="flex space-x-4">
              <Label>Tipo da consulta</Label>
              <Checkbox
                id="online"
                name="formatoConsulta"
                value="online"
                checked={formData.formatoConsulta === "online"}
                onCheckedChange={(checked) => handleChange(!!checked, "online")}

              />
              <Label htmlFor="online">Online</Label>

              <Checkbox
                id="presencial"
                name="formatoConsulta"
                value="presencial"
                checked={formData.formatoConsulta === "presencial"}
                onCheckedChange={(checked) =>
                  handleChange(!!checked, "presencial")
                }
              />
              <Label htmlFor="presencial">Presencial</Label>
            </div>

            {/* Valor */}
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                onChange={handleInputChange}
                value={formData.valor}
                required
              />
            </div>

            {/* Repetir */}
            <div className="flex items-center">
              <Checkbox
                id="repete"
                name="repete"
                checked={formData.repete}
                onCheckedChange={(checked) => handleChange(!!checked, "repete")}
              />
              <Label htmlFor="repete" className="ml-2">
                Repetir agendamento?
              </Label>
            </div>

            {/* Disponibilidades */}
            {formData.disponibilidade.map((disp, dispIndex) => (
              <div key={dispIndex} className="space-y-4 border-b pb-4 mb-4">
                <div>
                  <Label htmlFor={`dia-${dispIndex}`}>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !disp.dia && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {disp.dia ? (
                          format(disp.dia, "PPP", { locale: ptBR })
                        ) : (
                          <span>Escolha a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={disp.dia}
                        onSelect={(date) =>
                          setFormData((prevState) => {
                            const updatedDisponibilidade =
                              prevState.disponibilidade.map((d, i) =>
                                i === dispIndex ? { ...d, dia: date?? new Date() } : d
                              );
                            return {
                              ...prevState,
                              disponibilidade: updatedDisponibilidade,
                            };
                          })
                        }
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
                        <Label htmlFor={`inicio-${dispIndex}-${horarioIndex}`}>
                          Início
                        </Label>
                        <Input
                          id={`inicio-${dispIndex}-${horarioIndex}`}
                          name="inicio"
                          type="time"
                          value={horario.inicio}
                          onChange={(e) =>
                            handleHorarioChange(e, dispIndex, horarioIndex)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`fim-${dispIndex}-${horarioIndex}`}>
                          Fim
                        </Label>
                        <Input
                          id={`fim-${dispIndex}-${horarioIndex}`}
                          name="fim"
                          type="time"
                          value={horario.fim}
                          onChange={(e) =>
                            handleHorarioChange(e, dispIndex, horarioIndex)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`duracao-${dispIndex}-${horarioIndex}`}>
                          Duração (min)
                        </Label>
                        <Input
                          id={`duracao-${dispIndex}-${horarioIndex}`}
                          name="duracao"
                          type="number"
                          value={horario.duracao}
                          onChange={(e) =>
                            handleHorarioChange(e, dispIndex, horarioIndex)
                          }
                          readOnly // Somente leitura
                        />
                      </div>
                      <div className="flex justify-center items-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveHorario(dispIndex, horarioIndex)
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
                    onClick={() => handleAddHorario(dispIndex)}
                  >
                    Adicionar Horário
                  </Button>
                </div>

                <div className="flex justify-end mt-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveDisponibilidade(dispIndex)}
                  >
                    Remover Data
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleAddDisponibilidade}
            >
              <PlusCircle className="mr-2" />
              Adicionar Outra Data
            </Button>

            <Button
              className="w-full bg-blue-500 hover:bg-blue-800 mt-4"
              type="submit"
            >
              Criar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </MainLayout>
  );
};

export default CreateEvent;
