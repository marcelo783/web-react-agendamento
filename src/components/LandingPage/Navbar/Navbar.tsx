import  { useEffect, useState } from "react";
import { NavbarMenu } from "../../../mockData/data.js";
import { MdComputer, MdMenu } from "react-icons/md";
import { motion } from "framer-motion";
import ErroImg from '@/assets/person-calendar.png'; 
import ResponsiveMenu from "./ResponsiveMenu.js";
import { FcGoogle } from "react-icons/fc";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      // Redireciona o usuário diretamente para a URL de login do Google
      window.location.href = 'http://localhost:5000/auth/google';
    } catch (err) {
      console.error("Erro ao tentar autenticar:", err);
      setError("OOPS! Estamos com problemas para acessar o servidor. Tente novamente mais tarde!");
    }
  };
  

  const scrollToSection = (id: any) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  // Condição para exibir apenas a página de erro
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center fixed inset-0 z-50 bg-gray-100">
        <img
          src={ErroImg}
          alt="Error illustration"
          className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-8"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">OOPS!</h1>
        <p className="text-lg text-gray-600 mb-8 font-semibold text-center">
          {error}
        </p>
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300"
          onClick={() => setError(null)}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

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
          <div className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            <MdMenu className="text-4xl text-black" />
          </div>

          <div className="text-2xl flex items-center gap-2 font-bold mx-auto lg:mx-0">
            <MdComputer className="text-3xl text-two" />
            <p>Agenda Ki</p>
          </div>

          <div className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {NavbarMenu.map((item) => (
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
              ))}
            </ul>
          </div>

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

      <ResponsiveMenu isOpen={isOpen} onClose={handleCloseMenu} />
    </>
  );
};

export default Navbar;
