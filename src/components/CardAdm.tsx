import React, { useState } from "react";
import { FaCog } from "react-icons/fa"; // Ícone de engrenagem
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai"; // Ícones de calendário e relógio
import { ScrollArea } from "@/components/ui/scroll-area"; // Importando o Scroll-area do Shadcn
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Dropdown do Shadcn
import { FiEdit, FiTrash } from "react-icons/fi"; // Ícones de lápis e lixeira

interface CardAdmProps {
  titulo: string;
  descricao: string;
  paciente: string;
  formatoConsulta: string;
  status: string;
  data: string;
  inicio: string;
  fim: string;
  duracao: number;
  valor: number;
}

const getBorderColor = (status: string) => {
  switch (status) {
    case "disponivel":
      return "bg-green-500";
    case "cancelado":
      return "bg-red-500";
    case "concluido":
      return "bg-yellow-500";
    case "expirado":
      return "bg-purple-500";
    case "agendado":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const CardAdm: React.FC<CardAdmProps> = ({
  titulo,
  descricao,
  paciente,
  formatoConsulta,
  status,
  data,
  inicio,
  fim,
  duracao,
  valor,
}) => {
  const borderColor = getBorderColor(status);

  return (
    <div className="relative p-4 border rounded shadow-md w-88">
      {/* Linha colorida na parte superior do card */}
      <div className={`w-full h-1 ${borderColor} absolute top-0 left-0 rounded-t`} />

      {/* Dropdown Menu de configurações */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <button className="absolute top-2 right-2 text-gray-400">
            <FaCog />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 modal={false}">
          <DropdownMenuItem className="flex items-center space-x-2">
            <FiEdit className="text-gray-600" />
            <span>Editar</span>
          </DropdownMenuItem>
          <div className="py-2"></div>
          <DropdownMenuItem className="flex items-center space-x-2 text-red-600">
            <FiTrash className="text-red-600" />
            <span>Excluir</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Título do card centralizado com mais espaçamento */}
      <h2 className="text-lg font-semibold text-center mt-4 mb-2">{titulo}</h2>

      {/* Scroll Area para a descrição */}
      <ScrollArea className="h-16 mb-2 p-2 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-700">{descricao}</p>
      </ScrollArea>

      {/* Informações do paciente */}
      <p className="text-sm text-gray-800 mb-2">
        <strong>Paciente:</strong> {paciente}
      </p>
      
      {/* Formato da consulta e Status alinhados na mesma linha */}
      <div className="flex justify-between items-center text-sm text-gray-800 mb-2">
        <span>{formatoConsulta}</span>
        <span>{status}</span>
      </div>

      {/* Data e valor lado a lado */}
      <div className="flex justify-between items-center text-sm text-gray-800 mb-2">
        <div className="flex items-center">
          <AiOutlineCalendar className="mr-2" />
          <span>{data}</span>
        </div>
        <div className="text-gray-800">
          <span>R$</span> {valor.toFixed(2)}
        </div>
      </div>

      {/* Horário de início, fim e duração */}
      <div className="flex items-center text-sm text-gray-800">
        <AiOutlineClockCircle className="mr-2" />
        <span>
          <strong className="mr-2">Início:</strong> {inicio} <strong className="mr-2">Fim:</strong> {fim}{" "}
          <strong className="mr-2">Duração:</strong> {duracao}m
        </span>
      </div>
    </div>
  );
};

export default CardAdm;
