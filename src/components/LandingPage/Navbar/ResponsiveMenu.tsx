import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ResponsiveMenu = ({ isOpen }) => {

   // Função para rolar suavemente até a seção
   const scrollToSection = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" }); // Rolagem suave
      onClose(); // Fecha o menu após clicar no item
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 1, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className=" fixed  top-20 left-0 w-full h-screen z-20 lg:hidden"
        >
        <div className="text-xl font-semibold uppercase bg-one text-white py-10 m-6 rounded-3xl">
            <ul className="flex flex-col justify-center items-center gap-10">
              <li>
                <a
                  href="#inicio"
                  onClick={(e) => {
                    e.preventDefault(); // Previne o comportamento padrão
                    scrollToSection("#inicio");
                  }}
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="#vantagens"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#vantagens");
                  }}
                >
                  Vantagens
                </a>
              </li>
              <li>
                <a
                  href="#sobre"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#sobre");
                  }}
                >
                  Sobre nós
                </a>
              </li>
              <li>
                <a
                  href="#contato"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#contato");
                  }}
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
