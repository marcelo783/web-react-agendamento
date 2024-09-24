import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import accessToken from "@/cookies/appAccessToken";

const EditEvent = () => {
  const { googleCalendarId } = useParams(); // Captura o googleCalendarId da URL
  // Captura o googleCalendarId da URL
  const navigate = useNavigate();
  const [cookies] = useCookies(["accessToken"]); // Acessa o accessToken dos cookies

  const [formData, setFormData] = useState({
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

  // Função para buscar os dados do evento (incluindo agendamentoId) ao carregar a página
  useEffect(() => {
    const fetchEventData = async () => {
      if (!googleCalendarId) {
        console.error("ID do evento não encontrado");
        return;
      }

      try {
        // Agora, enviamos o cookie automaticamente
        const response = await axios.get(
          `http://localhost:5000/agendamentos/googleCalendar/${googleCalendarId}`,
          {
            withCredentials: true, // Inclui o cookie na requisição
          }
        );

        setFormData({
          agendamentoId: response.data._id,
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
  }, [googleCalendarId]);

  // Função para validar a data
  const isDateValid = (dateStr) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr); // Verifica formato 'YYYY-MM-DD'
  };

  // Função para validar o horário
  const isTimeValid = (timeStr) => {
    return /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.test(timeStr); // Verifica formato 'HH:MM'
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Verifica se o token foi definido corretamente
    const token = cookies.accessToken;
    if (!token) {
      console.error("AccessToken não encontrado.");
      return;
    }

    // Validação do e-mail do paciente
    if (!formData.pacienteEmail || !formData.pacienteEmail.includes("@")) {
      console.error("E-mail do paciente inválido.");
      return;
    }

    // Envia o token no header Authorization
    try {
      await axios.put(
        `http://localhost:5000/calendar/event/${googleCalendarId}`,
        formData, // Inclui o `pacienteEmail` no objeto enviado
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
                value={formData.descricao}
                onChane={handleInputChange}
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
              <div key={index} className="space-y-4">
                <Label htmlFor={`dia-${index}`}>Data</Label>
                <Input
                  type="date"
                  name={`dia-${index}`}
                  value={disp.dia?.slice(0, 10) || ""}
                  onChange={(e) => {
                    const updatedDisponibilidade = [
                      ...formData.disponibilidade,
                    ];
                    updatedDisponibilidade[index].dia = e.target.value;
                    setFormData({
                      ...formData,
                      disponibilidade: updatedDisponibilidade,
                    });
                  }}
                />

                {disp.horarios.map((horario, horarioIndex) => (
                  <div key={horarioIndex} className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`inicio-${index}-${horarioIndex}`}>
                        Início
                      </Label>
                      <Input
                        type="time"
                        name={`inicio-${index}-${horarioIndex}`}
                        value={horario.inicio}
                        onChange={(e) => {
                          const updatedHorarios = [...disp.horarios];
                          updatedHorarios[horarioIndex].inicio = e.target.value;
                          const updatedDisponibilidade = [
                            ...formData.disponibilidade,
                          ];
                          updatedDisponibilidade[index].horarios =
                            updatedHorarios;
                          setFormData({
                            ...formData,
                            disponibilidade: updatedDisponibilidade,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`fim-${index}-${horarioIndex}`}>
                        Fim
                      </Label>
                      <Input
                        type="time"
                        name={`fim-${index}-${horarioIndex}`}
                        value={horario.fim}
                        onChange={(e) => {
                          const updatedHorarios = [...disp.horarios];
                          updatedHorarios[horarioIndex].fim = e.target.value;
                          const updatedDisponibilidade = [
                            ...formData.disponibilidade,
                          ];
                          updatedDisponibilidade[index].horarios =
                            updatedHorarios;
                          setFormData({
                            ...formData,
                            disponibilidade: updatedDisponibilidade,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`duracao-${index}-${horarioIndex}`}>
                        Duração (min)
                      </Label>
                      <Input
                        type="number"
                        name={`duracao-${index}-${horarioIndex}`}
                        value={horario.duracao}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}

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
