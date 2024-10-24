import React, { useEffect, useState } from "react";
import { NavbarMenu } from "../../../mockData/data.js";
import { MdComputer, MdMenu } from "react-icons/md";
import { motion } from "framer-motion";

import ResponsiveMenu from "./ResponsiveMenu.js";
import { FcGoogle } from "react-icons/fc";

const Navbar = () => {
  const handleGoogleLogin  =  async ()  => {
    //await loginGoogle().then(res => console.log(res.data))
  
      // Redireciona o usuário para a URL de autenticação do Google
      window.location.href = 'http://localhost:5000/auth/google';
    };

  const [isOpen, setIsOpen] = React.useState(false);
  const [active, setActive] = useState<boolean>(false);

  const scrollToSection = (id:any) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

    // Função para fechar o menu
    const handleCloseMenu = () => {
      setIsOpen(false);
    };

  useEffect(() => {
    const scrollActive = () => {
      setActive(window.scrollY > 20);
    };
    window.addEventListener("scroll", scrollActive);
    return () => window.removeEventListener("scroll", scrollActive);
  }, [active]);

  return (
    <>
      <motion.div
        className={`${active ? "shadow-lg bg-white" : ""} fixed w-full left-0 z-20`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div
          className={`${
            active ? "py-2 transition-all duration-300" : "py-4"
          } container flex items-center justify-between max-auto`}
        >
          {/* mobile hamburguer menu */}
          <div className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            <MdMenu className="text-4xl text-black" />
          </div>

          {/* logo section */}
          <div className="text-2xl flex items-center gap-2 font-bold mx-auto lg:mx-0">
            <MdComputer className="text-3xl text-two" />
            <p>Agenda Ki</p>
          </div>

          {/* desktop menu section */}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {NavbarMenu.map((item) => {
                return (
                  <li key={item.id}>
                    <a
                      href={item.link}
                      onClick={(e) => {
                        e.preventDefault(); 
                        scrollToSection(item.link);
                      }}
                      className="inline-block text-gray-600 text-sm xl:text-base py-1 px-2 xl:px-3 hover:text-two transition-all duration-300 font-semibold"
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* login button section */}
          <div className="flex-shrink-0">
            <button
              className="flex items-center gap-2 font-semibold text-black border border-two rounded-full px-4 py-1 md:px-5 md:py-2 lg:px-6 lg:py-2 transition-all"
              onClick={handleGoogleLogin}
            >
              <FcGoogle />
              <span className="text-sm md:text-base lg:text-lg">Login</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* mobile sidebar section */}
      <ResponsiveMenu isOpen={isOpen} onClose={handleCloseMenu}/>
    </>
  );
};

export default Navbar;
