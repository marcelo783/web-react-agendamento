import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ptBR } from 'date-fns/locale';
import { useCookies } from 'react-cookie';
import { ScrollArea } from '@/components/ui/scroll-area';



const EventList = () => {
  const [cookies, setCookie] = useCookies(['accessToken']);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    agendamentoId: '',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/agendamentos');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao buscar eventos.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getAvailableDays = () => {
    const availableDays = events.map(event => event.disponibilidade.map(disponibilidade => new Date(disponibilidade.dia)));
    return [].concat(...availableDays);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);

    // Encontrar o evento que possui a disponibilidade correspondente à data selecionada
    const event = events.find(event =>
      event.disponibilidade.some(disponibilidade => format(new Date(disponibilidade.dia), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
    );

    if (event) {
      setSelectedEvent(event);  // Definir o evento selecionado
      const disponibilidade = event.disponibilidade.find(disponibilidade =>
        format(new Date(disponibilidade.dia), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      if (disponibilidade) {
        setAvailableTimes(disponibilidade.horarios);
      } else {
        setAvailableTimes([]);
      }
    } else {
      setAvailableTimes([]);
      setSelectedEvent(null);
    }
  };

  const handleOpenDialog = (agendamentoId) => {
    if (!selectedEvent) {
      console.error('Nenhum evento selecionado.');
      return;
    }
    console.log("Agendamento ID definido:", agendamentoId); 
    setFormData({ ...formData, agendamentoId: agendamentoId });  // Certifique-se de passar o agendamentoId corretamente
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      agendamentoId: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.telefone) {
      console.error('Todos os campos são obrigatórios.');
      return;
    }

    try {
      const token = cookies['accessToken'];

      const response = await axios.patch(
        'http://localhost:5000/agendamentos/agendar',
        {
          pacienteNome: formData.nome,
          pacienteEmail: formData.email,
          pacienteTelefone: formData.telefone,
          agendamentoId: formData.agendamentoId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Resposta do servidor:', response.data);

     

      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao enviar os dados do agendamento:', error);
    }
  };

  if (loading) {
    return <p>Carregando eventos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded shadow-sm">
          {selectedEvent ? (
            <div>
              <h2 className="text-xl font-bold mb-2">{selectedEvent.titulo}</h2>
              <ScrollArea className="h-24 mb-2  bg-gray-100 rounded-lg">
              <p><strong></strong> {selectedEvent.descricao}</p>
              </ScrollArea>
             

              <p><strong>Formato da Consulta:</strong> {selectedEvent.formatoConsulta}</p>
              <p><strong>Status:</strong> {selectedEvent.status}</p>
              <p><strong>Valor:</strong> R$ {selectedEvent.valor.toFixed(2)}</p>
            </div>
          ) : (
            <p>Selecione uma data para ver as informações da consulta.</p>
          )}
        </div>

        <div className="p-4 border rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Selecione uma Data & Hora</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            modifiers={{
              highlighted: getAvailableDays(),
            }}
            modifiersStyles={{
              highlighted: {
                backgroundColor: '#3b82f6',
                color: 'white',
              },
            }}
          />
        </div>

        <div className="p-4 border rounded shadow-sm">
          {selectedDate ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Horários disponíveis para {format(selectedDate, 'PPPP', { locale: ptBR })}</h2>
              {availableTimes.length > 0 ? (
                <ul className="space-y-2">
                  {availableTimes.map((time, index) => (
                    <li key={index} className="flex justify-between items-center p-2 border rounded shadow-sm">
                      <div>
                        <p><strong>Início:</strong> {time.inicio}</p>
                        <p><strong>Fim:</strong> {time.fim}</p>
                        <p><strong>Duração:</strong> {time.duracao} minutos</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() => handleOpenDialog(selectedEvent._id)}
                          >
                            Agendar
                          </Button>
                        </DialogTrigger>
                        {selectedEvent && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Agendar Consulta</DialogTitle>
                              <DialogDescription>
                                Preencha os campos abaixo para confirmar o agendamento:
                              </DialogDescription>
                            </DialogHeader>

                            <div className="mb-4">
                              <p><strong>Título:</strong> {selectedEvent.titulo}</p>
                              <ScrollArea className="h-16 mb-2  bg-gray-100 rounded-lg">
                              <p><strong>Descrição:</strong> {selectedEvent.descricao}</p>
                              </ScrollArea>
                              
                              <p><strong>Formato Consulta:</strong> {selectedEvent.formatoConsulta}</p>
                              <p><strong>Valor:</strong> R$ {selectedEvent.valor.toFixed(2)}</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                              <div>
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
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
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
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
                              <Button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
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
            </div>
          ) : (
            <p>Selecione uma data para ver os horários disponíveis.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventList;