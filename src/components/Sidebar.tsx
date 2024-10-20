import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdMenuOpen } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { FaProductHunt, FaUserCircle } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { FaCalendarDays } from "react-icons/fa6";
import logo from "../assets/pactto-logo.svg"; // Atualize o caminho conforme necessário

const menuItems = [
  {
    icons: <IoHome size={20} />,
    label: "adm",
    path: "/adm",
  },
  {
    icons: <IoIosAddCircle size={20} />,
    label: "Criar",
    path: "/create-event",
  },
  {
    icons: <FaCalendarDays size={20} />,
    label: "EventList",
    path: "/EventList",
  },
  {
    icons: <FaProductHunt size={20} />,
    label: "setting",
    path: "/DataTest",
  },
  {
    icons: <FaProductHunt size={20} />,
    label: "logs",
    path: "/logs",
  },
];

export default function Sidebar({ isOpen, onToggle }) {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation(); // Usado para capturar a rota atual e destacar o item ativo

  // Efeito para verificar se estamos no mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Defina a largura do mobile como 768px ou qualquer valor desejado
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Adiciona overflow-hidden ao body quando o sidebar estiver aberto no mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobile, isOpen]);

  return (
    <nav
      className={`shadow-md h-screen p-2 flex flex-col bg-blue-600 text-white fixed top-0 z-50 transition-all duration-500 ${
        isOpen ? "w-56" : "w-16"
      } ${isMobile && isOpen ? "absolute w-56" : "fixed"}`}
    >
      {/* Cabeçalho com Logo e Botão de Menu */}
      <div className="border px-3 py-2 h-20 flex justify-between items-center">
        <img
          src={logo}
          alt="Logo"
          className={`transition-all duration-300 ${isOpen ? "w-10" : "w-0"}`}
        />
        <MdMenuOpen
          size={34}
          className={`cursor-pointer transition-transform duration-500 ${
            !isOpen && "rotate-180"
          }`}
          onClick={onToggle}
        />
      </div>

      {/* Itens do Menu */}
      <ul className="flex-1 mt-4">
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index}>
            <li
              className={`px-3 py-2 my-2 hover:bg-blue-800 rounded-md duration-300 cursor-pointer flex gap-2 items-center ${
                location.pathname === item.path ? "bg-blue-900" : ""
              }`}
            >
              <div>{item.icons}</div>
              <span
                className={`transition-all duration-300 whitespace-nowrap ${
                  !isOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
              >
                {item.label}
              </span>
            </li>
          </Link>
        ))}
      </ul>

      {/* Seção de Usuário */}
      <div className="flex items-center gap-2 px-3 py-2">
        <FaUserCircle size={20} />
        <div
          className={`leading-5 transition-all duration-300 ${
            !isOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
          }`}
        >
          <p>mcl</p>
          <span className="text-xs">mcl@gmail.com</span>
        </div>
      </div>
    </nav>
  );
}
