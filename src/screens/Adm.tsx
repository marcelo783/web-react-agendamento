import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import CardAdm from "@/components/CardAdm";
import HorizontalCalendar from "@/components/HorizontalCalendar";
import Pagination from "@/components/ui/pagination";
import MainLayout from "@/components/MainLayout";

const ITEMS_PER_PAGE = 6;

const Adm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEvents = async (searchTerm = "", selectedDate = null) => {
    try {
      let endpoint = "http://localhost:5000/agendamentos";
      const params = [];

      if (searchTerm) params.push(`titulo=${searchTerm}`);
      if (selectedDate) params.push(`data=${selectedDate}`);
      if (params.length > 0) endpoint += `?${params.join("&")}`;

      const response = await axios.get(endpoint, { withCredentials: true });
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  const fetchPacienteById = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/pacientes/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data.nome;
    } catch (error) {
      console.error("Erro ao buscar paciente:", error);
      return "Paciente não encontrado";
    }
  };

  // useEffect(() => {
  //   fetchEvents();
  // }, []);

  useEffect(() => {
    fetchEvents(searchTerm, selectedDate);
  }, [searchTerm, selectedDate]);

  // Busca o nome do paciente para cada evento ao carregar a página
  useEffect(() => {
    events.forEach(async (event: any) => {
      // Busca os IDs dos pacientes nos horários
      event.disponibilidade
        ?.flatMap((disp: any) => disp.horarios)
        ?.forEach(async (horario: any) => {
          if (horario.paciente && !pacientes[horario.paciente]) {
            const nomePaciente = await fetchPacienteById(horario.paciente);
            setPacientes((prev) => ({
              ...prev,
              [horario.paciente]: nomePaciente,
            }));
          }
        });
    });
  }, [events]);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <MainLayout>
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex flex-col lg:flex-row p-4 items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="w-full lg:w-1/4">
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-2/3">
            <HorizontalCalendar
              onSelectDate={(date: any) =>
                setSelectedDate(date.toISOString().split("T")[0])
              }
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {selectedEvents.length > 0 ? (
            selectedEvents.map((event, index) => (
              <CardAdm
              
                key={event._id || index}
                _id={event._id}
                googleCalendarId={event.googleCalendarId}
                titulo={event.titulo}
                descricao={event.descricao}
                paciente={
                  event.disponibilidade?.flatMap((disp) =>
                    disp.horarios.map(
                      (horario) =>
                        pacientes[horario.paciente] || "Carregando..."
                    )
                  ) || "Nenhum paciente"
                }
                status={
                  event.disponibilidade?.flatMap((disp: any) =>
                    disp.horarios.map((horario: any) => horario.status)
                  )[0] || "Indefinido"
                }
                formatoConsulta={event.formatoConsulta}
                data={
                  event.disponibilidade && event.disponibilidade.length > 0
                    ? new Date(
                        event.disponibilidade[0].dia
                      ).toLocaleDateString()
                    : "Data não disponível"
                }
                inicio={
                  event.disponibilidade?.[0]?.horarios?.[0]?.inicio || "N/A"
                }
                fim={event.disponibilidade?.[0]?.horarios?.[0]?.fim || "N/A"}
                duracao={
                  event.disponibilidade?.[0]?.horarios?.[0]?.duracao || "N/A"
                }
                valor={event.valor}
                disponibilidade={event.disponibilidade}
                pacientes={pacientes}
                onUpdateStatus={(
                  dispIndex: number,
                  horarioIndex: number,
                  newStatus: string
                ) => {
                  setEvents((prevEvents) =>
                    prevEvents.map((e) =>
                      e._id === event._id
                        ? {
                            ...e,
                            disponibilidade: e.disponibilidade.map(
                              (disp, dIndex) =>
                                dIndex === dispIndex
                                  ? {
                                      ...disp,
                                      horarios: disp.horarios.map(
                                        (horario, hIndex) =>
                                          hIndex === horarioIndex
                                            ? { ...horario, status: newStatus }
                                            : horario
                                      ),
                                    }
                                  : disp
                            ),
                          }
                        : e
                    )
                  );
                  
                }}
               
              />
              
            ))
          ) : (
            <p>Nenhum evento encontrado.</p>
          )}
          
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </MainLayout>
  );
};

export default Adm;
