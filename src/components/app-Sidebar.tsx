// AppSidebar.tsx
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { FaProductHunt } from "react-icons/fa";

import { IoIosAddCircle } from "react-icons/io";
import { FaCalendarDays } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";

import { MdDashboard } from "react-icons/md";

const menuItems = [
  {
    icons: <MdDashboard size={20} />,
    label: "Adm",
    path: "/adm",
  },
  {
    icons: <IoIosAddCircle size={20} />,
    label: "Criar",
    path: "/create-event",
  },
  {
    icons: <FaCalendarDays size={20} />,
    label: "Disponibilidade",
    path: "/EventList",
  },
  {
    icons: <IoStatsChart size={20} />,
    label: "Dashboard",
    path: "/dashboard",
  },
];

export function AppSidebar() {
  const location = useLocation(); // Adicionei o useLocation para comparar a rota ativa

  return (
    <Sidebar>
      <SidebarContent className="bg-blue-600 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white font-semibold border px-3 py-2 h-20">
            Agenda Ki
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={`px-3 py-2 my-2 hover:bg-blue-800 rounded-md duration-300 cursor-pointer flex gap-2 items-center ${
                    location.pathname === item.path ? "bg-blue-900" : ""
                  }`}
                >
                  <Link to={item.path} className="flex gap-2 items-center">
                    <div>{item.icons}</div>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                </li>
              ))}
              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
