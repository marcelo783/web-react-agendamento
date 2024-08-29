import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar'; // Use o componente Calendar do shadcn
import { Button } from '@/components/ui/button';
import { ptBR } from 'date-fns/locale';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  // Função para processar os dias disponíveis
  const getAvailableDays = () => {
    const availableDays = events.map(event => event.disponibilidade.map(disponibilidade => new Date(disponibilidade.dia)));
    return [].concat(...availableDays);
  };

  // Função para processar os horários disponíveis para o dia selecionado
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const event = events.find(event =>
      event.disponibilidade.some(disponibilidade => format(new Date(disponibilidade.dia), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
    );
    if (event) {
      setSelectedEvent(event);
      const disponibilidade = event.disponibilidade.find(disponibilidade =>
        format(new Date(disponibilidade.dia), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      if (disponibilidade) {
        setAvailableTimes(disponibilidade.horarios);
      }
    } else {
      setAvailableTimes([]);
      setSelectedEvent(null);
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
        {/* Informações sobre a consulta */}
        <div className="p-4 border rounded shadow-sm">
          {selectedEvent ? (
            <div>
              <h2 className="text-xl font-bold mb-2">{selectedEvent.titulo}</h2>
              <p><strong>Descrição:</strong> {selectedEvent.descricao}</p>
              <p><strong>Formato da Consulta:</strong> {selectedEvent.formatoConsulta}</p>
              <p><strong>Status:</strong> {selectedEvent.status}</p>
              <p><strong>Valor:</strong> R$ {selectedEvent.valor.toFixed(2)}</p>
            </div>
          ) : (
            <p>Selecione uma data para ver as informações da consulta.</p>
          )}
        </div>

        {/* Calendário */}
        <div className="p-4 border rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Selecione uma Data & Hora</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            modifiers={{
              highlighted: getAvailableDays(), // Destaque os dias disponíveis
            }}
            modifiersStyles={{
              highlighted: {
                backgroundColor: '#3b82f6', // Cor azul para dias disponíveis
                color: 'white',
              },
            }}
          />
        </div>

        {/* Horários Disponíveis */}
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
                      <Button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => console.log('Função de agendar a ser implementada')}
                      >
                        Agendar
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum horário disponível para este dia.</p>
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
