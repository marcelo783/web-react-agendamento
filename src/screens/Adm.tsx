import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import CardAdm from '@/components/CardAdm'; // Importando o componente
import HorizontalCalendar from '@/components/HorizontalCalendar';
import Pagination from '@/components/ui/pagination';

import MainLayout from '@/components/MainLayout';




const ITEMS_PER_PAGE = 6; // Quantidade de cards por página

const Adm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1); 

  const [pacientes, setPacientes] = useState<PacientesState>({});  // Inicializando como um objeto vazio

  // type EventType = {
  //   paciente?: string;  // Ou use o tipo correto do campo 'paciente'
  //   // Outros campos do evento
  // };
  
  // Tipo para o estado 'pacientes'
  type PacientesState = {
    [key: string]: string;  // Um objeto onde a chave é o ID do paciente e o valor é o nome do paciente
  };
  
  // Estado para controlar a página atual

  // Função para buscar os eventos da API com os filtros aplicados
  const fetchEvents = async (searchTerm = '', selectedDate = null) => {
    try {
      let endpoint = 'http://localhost:5000/agendamentos';
      const params = [];
  
      if (searchTerm) params.push(`titulo=${searchTerm}`);
      if (selectedDate) params.push(`data=${selectedDate}`);
      if (params.length > 0) {
        endpoint += `?${params.join('&')}`;
      }
  
      // Agora usamos withCredentials para incluir cookies automaticamente
      const response = await axios.get(endpoint, { withCredentials: true });
      setEvents(response.data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };
  
  // Também aplique essa configuração em outras chamadas axios
  const fetchPacienteById = async (id:any) => {
    try {
      const response = await axios.get(`http://localhost:5000/pacientes/${id}`, {
        withCredentials: true,
      });
      return response.data.nome;
    } catch (error) {
      console.error('Erro ao buscar o paciente:', error);
      return 'Paciente não encontrado';
    }
  };
  
  // Função para atualizar um evento no estado 'events'
  // const handleEventUpdate = (updatedEvent:any) => {
  //   setEvents((prevEvents:any) => {
  //     return prevEvents.map((event:any) =>
  //       event._id === updatedEvent._id ? updatedEvent : event
  //     );
  //   });
  // };
  
  

  // Efeito para buscar os eventos ao carregar a página
  useEffect(() => {
    fetchEvents();
  }, []);

  // Efeito para buscar os eventos sempre que searchTerm ou selectedDate mudar
  useEffect(() => {
    fetchEvents(searchTerm, selectedDate);
  }, [searchTerm, selectedDate]);

  const handleDateSelect = (date:any) => {
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // Busca o nome do paciente para cada evento ao carregar a página
  useEffect(() => {
    events.forEach(async (event:any) => {
      console.log('ID do Paciente:', event.paciente);  // Verifique se o ID está correto
      if (event.paciente && !pacientes[event.paciente]) {
        const nomePaciente = await fetchPacienteById(event.paciente);
        setPacientes((prev) => ({ ...prev, [event.paciente]: nomePaciente }));
      }
    });
  }, [events]);
  

  // Lógica de paginação
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Funções para navegação da paginação
  // const goToNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const goToPreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };
  

  return (
    <MainLayout>
     
    <div className="flex flex-col p-4 space-y-4">
      
      {/* Primeira Div: Input e Calendário */}
      <div className="flex flex-col lg:flex-row p-4 items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/4">
          <Input
            placeholder="Pesquisar..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full lg:w-2/3">
          <HorizontalCalendar onSelectDate={handleDateSelect} />
        </div>
      </div>

      {/* Segunda Div: Cards, agora posicionados abaixo do input e do calendário */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {selectedEvents.length > 0 ? (
    selectedEvents.map((event:any, index) => {
      // Verifica o conteúdo de cada evento aqui

      return (
        <CardAdm
        key={event._id || index}  // Use _id
        _id={event._id}
        googleCalendarId={event.googleCalendarId}  // Passe _id corretamente para o CardAdm
          titulo={event.titulo}
          descricao={event.descricao}
          paciente={event.paciente ? (pacientes[event.paciente] || 'Carregando...') : 'ID não disponível'}
          formatoConsulta={event.formatoConsulta}
          status={event.status}
          data={new Date(event.disponibilidade[0].dia).toLocaleDateString()}
          inicio={event.disponibilidade[0].horarios[0]?.inicio || 'N/A'}
          fim={event.disponibilidade[0].horarios[0]?.fim || 'N/A'}
          duracao={event.disponibilidade[0].horarios[0]?.duracao || 'N/A'}
          valor={event.valor}
         
        />
      );
    })
  ) : (
    <p>Nenhum evento encontrado.</p>
  )}
</div>

   
      

       {/* Utilizando o novo componente de paginação */}
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