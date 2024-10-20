import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";

const NavbarBanner = () => {
    const [isOpen, setIsOpen] = React.useState(true);

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
   isOpen && (
    <motion.div 
    initial={{opacity:0}}
    animate={{opacity:1}}
    transition={{duration: 0.5, delay: 0.7}}
    
    className={`${active ? "py-1 transition-all duration-300" : "py-1 top-[67px]"} fixed w-full top-[56px] left-0 z-20 bg-one text-sm text-center font-semibold p-1 hidden lg:block`}>
        você está em busca de fazer agendamentos de consulta com piscólogos?
        <a href='#' className='text-two ml-2'>fale conosco!</a>
        <div className='absolute top-1/2 right-10 cursor-pointer -translate-y-1/2'
        onClick={() => setIsOpen(false)}
        >
            x
        </div>
    </motion.div>
   )
  )
}
export default NavbarBanner;