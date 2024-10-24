import  { useState, useEffect } from "react";
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  addDays,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HorizontalCalendarProps = {
  onSelectDate: (date: Date) => void; // Define o tipo da função onSelectDate
};

const HorizontalCalendar = ({ onSelectDate }: HorizontalCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(null); // Data selecionada pelo usuário
  const [daysToShow, setDaysToShow] = useState(7); // Número de dias para exibir

  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleDayClick = (date:any) => {
    setSelectedDate(date);
    if (onSelectDate) {
      onSelectDate(date); // Passa a data selecionada para o componente pai
    }
  };

  const handleMonthChange = (event:any) => {
    const newMonth = event.target.value;
    const newDate = new Date(currentDate);
    newDate.setMonth(newMonth);

    if (!isNaN(newDate.getTime())) {
      setCurrentDate(newDate);
    } else {
      console.error("Data inválida ao alterar o mês", newDate);
    }
  };

  const handleYearChange = (event:any) => {
    const newYear = event.target.value;
    const newDate = new Date(currentDate);
    newDate.setFullYear(newYear);

    if (!isNaN(newDate.getTime())) {
      setCurrentDate(newDate);
    } else {
      console.error("Data inválida ao alterar o ano", newDate);
    }
  };

  // Ajustar o número de dias a serem exibidos com base na largura da tela
  useEffect(() => {
    const updateDaysToShow = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setDaysToShow(7); // Desktop, exibe todos os dias
      } else if (width >= 768) {
        setDaysToShow(5); // Tablet, exibe 5 dias
      } else {
        setDaysToShow(3); // Mobile, exibe 3 dias
      }
    };

    updateDaysToShow();
    window.addEventListener("resize", updateDaysToShow);
    return () => window.removeEventListener("resize", updateDaysToShow);
  }, []);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: daysToShow }).map((_, index) =>
    addDays(startOfCurrentWeek, index)
  );

  const renderDaysOfWeek = () => {
    return daysOfWeek.map((date, index) => {
      if (isNaN(date.getTime())) {
        console.error("Data inválida ao renderizar dias da semana", date);
        return null; // Pula a renderização de uma data inválida
      }

      const isSelected =
        selectedDate &&
        format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
      const isCurrentDay = isToday(date);

      return (
        <div
          key={index}
          className={`p-1 rounded-lg text-center cursor-pointer text-sm
            ${isSelected ? "bg-blue-600 text-white" : ""}
            ${!isSelected && isCurrentDay ? "bg-gray-200 text-gray-800" : "text-gray-600"}`}
          onClick={() => handleDayClick(date)}
          style={{ minWidth: "40px" }}
        >
          <div className="font-semibold">
            {format(date, "EEE", { locale: ptBR })}
          </div>
          <div>{format(date, "d")}</div>
        </div>
      );
    });
  };

  const months = Array.from({ length: 12 }).map((_, index) => (
    <option key={index} value={index}>
      {format(new Date(2020, index, 1), "MMMM", { locale: ptBR })}
    </option>
  ));

  const years = Array.from({ length: 10 }).map((_, index) => (
    <option key={index} value={new Date().getFullYear() - 5 + index}>
      {new Date().getFullYear() - 5 + index}
    </option>
  ));

  return (
    <div className="flex flex-col items-center bg-white shadow-lg p-4 rounded-lg w-full max-w-lg">
      <div className="flex justify-between items-center mb-2 w-full text-sm">
        <select 
          value={currentDate.getMonth()}
          onChange={handleMonthChange}
          className="p-1 bg-gray-200 rounded "
        >
          {months}
        </select>
        <select
          value={currentDate.getFullYear()}
          onChange={handleYearChange}
          className="p-1 bg-gray-200 rounded  "
        >
          {years}
        </select>
      </div>

      <div className="flex justify-between items-center mb-2 w-full max-w-full overflow-x-auto">
        <button onClick={handlePrevWeek} className="mr-1">
          <ChevronLeft size={16} />
        </button>
        <div className="flex justify-between w-full mx-1">
          {renderDaysOfWeek()}
        </div>
        <button onClick={handleNextWeek} className="ml-1">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default HorizontalCalendar;
