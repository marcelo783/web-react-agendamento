import React, { useEffect, useState } from "react";
import { NavbarMenu } from "../../../mockData/data.js";
import { MdComputer, MdMenu } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu.js";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [active, setActive] = useState(null);

  const scrollToSection = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" }); // Rolagem suave
    }
  }; 

  useEffect(() => {
    const scrollActive = () => {
      setActive(window.scrollY > 20 );
    }
    window.addEventListener("scroll", scrollActive);
    return () => window.removeEventListener("scroll", scrollActive)
  }, [active]);

  return (
    <>
      <motion.div className={`${active ? "shadow-lg bg-white" : ""} fixed w-full  left-0 z-20`}
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{duration: 0.5, delay: 0.5}}
      >
        <div className={`${active ? "py-2 transition-all duration-300" : "py-6 " } container flex justify-between items-center max-auto`}>
          {/*logo section */}
          <div className="text-2xl flex items-center gap-2 font-bold">
            <MdComputer className="text-3xl text-two" />
            <p>E-Tutor</p>
          </div>
          {/*menu section */}

          <div className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {NavbarMenu.map((item) => {
                return (
                  <li key={item.id}>
                    <a
                      href={item.link}
                      onClick={(e) => {
                        e.preventDefault(); // Previne o comportamento padrão do link
                        scrollToSection(item.link); // Chama a função de rolagem suave
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
          {/*cta button section */}

          <div className="hidden lg:block space-x-6">
            <button
              className="font-semibold text-white bg-two rounded-full px-6 py-2"
              onClick={handleLoginClick}
            >
              Login com Google
            </button>
          </div>

          {/*mobile hamburguer menu */}
          <div className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            <MdMenu className="text-4xl"/>
          </div>

        </div>
      </motion.div>

       {/*mobile sidebar section*/}
      <ResponsiveMenu isOpen={isOpen}/>
    </>
  );
};

export default Navbar;
