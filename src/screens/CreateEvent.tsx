import React, { useState } from "react";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils"; // certifique-se de que esse utilitário está implementado no seu projeto
import Input from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    formatoConsulta: "",
    valor: "",
    repete: false,
    disponibilidade: [
      {
        dia: null, // Alterado para Date ou null
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

  const handleChange = (checked: boolean, name: string) => {
    setFormData((prevState) => {
      if (name === "repete") {
        // Atualiza o campo repete
        return {
          ...prevState,
          repete: checked,
        };
      } else {
        // Atualiza o campo formatoConsulta
        return {
          ...prevState,
          formatoConsulta: checked ? name : "",
        };
      }
    });
  };
  

  const handleHorarioChange = (e, index) => {
    const { name, value } = e.target;
    const updatedHorarios = formData.disponibilidade[0].horarios.map(
      (horario, i) => (i === index ? { ...horario, [name]: value } : horario)
    );

    setFormData((prevState) => ({
      ...prevState,
      disponibilidade: [
        { ...prevState.disponibilidade[0], horarios: updatedHorarios },
      ],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
    // Lógica para enviar os dados para o backend
  };

  return (
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onCheckedChange={(checked) => handleChange(checked, "online")}
              />
              <Label htmlFor="online">Online</Label>

              <Checkbox
                id="presencial"
                name="formatoConsulta"
                value="presencial"
                checked={formData.formatoConsulta === "presencial"}
                onCheckedChange={(checked) =>
                  handleChange(checked, "presencial")
                }
              />
              <Label htmlFor="presencial">Presencial</Label>
            </div>

            {/* Valor */}
            <div>
              <Label htmlFor="valor">Value</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                onChange={handleChange}
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
                onCheckedChange={(checked) => handleChange(checked, "repete")}
              />
              <Label htmlFor="repete" className="ml-2">
                Repeat
              </Label>
            </div>

            {/* Data */}
            <div>
              <Label htmlFor="dia">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.disponibilidade[0].dia &&
                        "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.disponibilidade[0].dia ? (
                      format(formData.disponibilidade[0].dia, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.disponibilidade[0].dia}
                    onSelect={(date) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        disponibilidade: [
                          { ...prevState.disponibilidade[0], dia: date },
                        ],
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Horários */}
            <div className="space-y-4">
              <Label>Available Times</Label>
              {formData.disponibilidade[0].horarios.map((horario, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`inicio-${index}`}>Start</Label>
                    <Input
                      id={`inicio-${index}`}
                      name="inicio"
                      type="time"
                      value={horario.inicio}
                      onChange={(e) => handleHorarioChange(e, index)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`fim-${index}`}>End</Label>
                    <Input
                      id={`fim-${index}`}
                      name="fim"
                      type="time"
                      value={horario.fim}
                      onChange={(e) => handleHorarioChange(e, index)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`duracao-${index}`}>Duration (min)</Label>
                    <Input
                      id={`duracao-${index}`}
                      name="duracao"
                      type="number"
                      value={horario.duracao}
                      onChange={(e) => handleHorarioChange(e, index)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="w-full bg-blue-500 hover:bg-blue-800"
              type="submit"
            >
              Create Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;
