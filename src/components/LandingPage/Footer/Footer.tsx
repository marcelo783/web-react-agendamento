import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { MdComputer } from "react-icons/md";
import { motion } from "framer-motion";
import FooterImg from "../../../assets/footer.jpg";
import personImg from "../../../assets/person-calendar.png";

const FooterBg = {
  backgroundImage: `url(${FooterImg})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "bottom center",
};

const Footer = () => {

  const [active, setActive] = useState(null);

  const scrollToSection = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGoogleLogin  =  async ()  => {
    //await loginGoogle().then(res => console.log(res.data))
  
      // Redireciona o usuário para a URL de autenticação do Google
      window.location.href = 'http://localhost:5000/auth/google';
    };


  return (
    <div id="contato" style={FooterBg} className="rounded-t-3xl">
      <div className="bg-primary/5">
        <div className="container">
          <div className="grid md:grid-cols-4 md:gap-4 py-5 border-t-2 border-gray-300/10 text-black">
            {/* brand info section */}
            <div className="py-8 px-4 space-y-4">
              <div className="text-2xl flex items-center gap-2 font-bold ">
                {/* <MdComputer className="text-two text-4xl" />  */}
                <p className="">Agenda Ki</p>
              </div>
              <div className='flex justify-center items-center'>
          <motion.img
          initial={{ opacity: 0, x: -200}}
          animate={{ opacity: 1, x: 0}}
          transition={{ type: "spring", stiffness: 100, delay:0.2}}
        src={personImg} 
        alt="Hero" 
        className='w-[300px] md:w-[550]  xl:w-[700]'/>
        </div>
            </div>
            {/* Footer Links  */}
            <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 md:ml-14">
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-5">
                  Important Links
                </h1>
                <ul className="flex flex-col gap-3">
                  <li>
                    <a href="#" className=" hover:text-two duration-200">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className=" hover:text-two duration-200">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className=" hover:text-two duration-200">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#" className=" hover:text-two duration-200">
                      Login
                    </a>
                  </li>
                </ul>
              </div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-5">
                  recursos
                </h1>
                <ul className="flex flex-col gap-3">
                  <li>
                  <a
                  href="#inicio"
                  onClick={(e) => {
                    e.preventDefault(); // Previne o comportamento padrão
                    scrollToSection("#inicio");
                  }}
                  className=" hover:text-two duration-200"
                >
                  Início
                </a>
                  </li>
                  <li>
                  <a
                  href="#vantagens"
                  onClick={(e) => {
                    e.preventDefault(); // Previne o comportamento padrão
                    scrollToSection("#vantagens");
                  }}
                  className=" hover:text-two duration-200"
                >
                  Vantagens
                </a>
                  </li>
                  <li>
                  <a
                  href="#sobre"
                  onClick={(e) => {
                    e.preventDefault(); // Previne o comportamento padrão
                    scrollToSection("#sobre");
                  }}
                  className=" hover:text-two duration-200"
                >
                  Sobre nós
                </a>
                  </li>
                  <li>
                    <a  onClick={handleGoogleLogin} className=" hover:text-two duration-200">
                      Login
                    </a>
                  </li>
                </ul>
              </div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-5">
                  Redes sociais
                </h1>
                <div className="flex items-center justify-start gap-5 !mt-6">
                  <a href="#" className=" hover:text-two duration-200">
                    <HiLocationMarker className="text-3xl" />
                  </a>
                  <a href="#" className=" hover:text-two duration-200">
                    <FaInstagram className="text-3xl" />
                  </a>
                  <a href="#" className=" hover:text-two duration-200">
                    <FaFacebook className="text-3xl" />
                  </a>
                  <a href="#" className=" hover:text-two duration-200">
                    <FaLinkedin className="text-3xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* copyright section  */}
          <div className="mt-8">
            <div className="text-center py-6 border-t-2 border-gray-800/10">
              <span className="text-sm text-black/60">
                {" "}
                @copyright 2024 Marcelo.dev
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;