import { useState } from "react";
import logo from "../assets/pactto-logo.svg";
import { Link } from "react-router-dom";
import { MdMenuOpen } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { FaProductHunt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { FaCalendarDays } from "react-icons/fa6";

type MenuItem = {
  icons: JSX.Element;
  label: string;
  path: string;
};

const menuItems: MenuItem[] = [
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
    label: "calendar",
    path: "/calendar",
  },
  {
    icons: <FaProductHunt size={20} />,
    label: "setting",
    path: "/settings",
  },
  {
    icons: <FaProductHunt size={20} />,
    label: "logs",
    path: "/logs",
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <nav
      className={`shadow-md h-screen p-2 flex flex-col duration-500 bg-blue-600 text-white ${
        open ? "w-60" : "w-16"
      }`}
    >
      <div className="border px-3 py-2 h-20 flex justify-between items-center">
        <img
          src={logo}
          alt="Logo"
          className={`${open ? "w-10" : "w-0"} rounded-md`}
        />
        <div>
          <MdMenuOpen
            size={34}
            className={`duration-500 cursor-pointer ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>
      <ul className="flex-1">
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index}>
            <li
              className="px-3 py-2 my-2 hover:bg-blue-800 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group"
            >
              <div>{item.icons}</div>
              <p
                className={`${
                  !open && "w-0 translate-x-24"
                } duration-500 overflow-hidden`}
              >
                {item.label}
              </p>
              <p
                className={`${
                  open && "hidden"
                } absolute left-32 shadow-md rounded-md w-0 p-0 text-black bg-white duration-300 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16`}
              >
                {item.label}
              </p>
            </li>
          </Link>
        ))}
      </ul>
      <div className="flex items-center gap-2 px-3 py-2">
        <div>
          <FaUserCircle size={20} />
        </div>
        <div
          className={`leading-5 ${
            !open && "w-0 translate-x-24"
          } duration-500 overflow-hidden`}
        >
          <p>mcl</p>
          <span className="text-xs">mcl@gmail.com</span>
        </div>
      </div>
    </nav>
  );
}
