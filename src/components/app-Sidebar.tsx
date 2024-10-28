import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { FaProductHunt, FaUserCircle } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import { FaCalendarDays } from "react-icons/fa6";
import { Link } from "react-router-dom";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
  } from "@/components/ui/sidebar"


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
      icons: <FaUserCircle size={20} />,
      label: "User",
      path: "/User",
    },
  ];

export function AppSidebar() {
    return (
        <Sidebar >
          <SidebarContent className="bg-blue-600 text-white">
            <SidebarGroup>
              <SidebarGroupLabel className="text-white font-semibold border px-3 py-2 h-20">Agenda Ki</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                {menuItems.map((item, index) => (
              <Link to={item.path} key={index}>
                <li
                  className={`px-3 py-2 my-2 bg-color-black hover:bg-blue-800 rounded-md duration-300 cursor-pointer flex gap-2 items-center ${
                    location.pathname === item.path ? "bg-blue-900" : ""
                  }`}
                >
                  <div>{item.icons}</div>
                  <span
                    className="transition-all duration-300 whitespace-nowrap"
                  >
                    {item.label}
                  </span>
                </li>
              </Link>
            ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )
}
