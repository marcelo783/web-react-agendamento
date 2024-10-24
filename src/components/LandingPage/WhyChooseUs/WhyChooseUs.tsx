
import { FaGlobe, FaClock, FaMoneyBillWave, FaLock } from "react-icons/fa";
import {  motion } from "framer-motion";

import { SlideLeft } from "@/utility/animation";

const WhyChooseData = [
  {
    id: 1,
    title: "Acessibilidade Geográfica",
    descrição:
      "Você pode se conectar com seu psicólogo de qualquer lugar, seja de casa, do trabalho ou durante viagens.",
    Icon: <FaGlobe />, // Representa o alcance global e acessibilidade
    brColor: "#2563Eb",
    delay: 0.3,
  },

  {
    id: 2,
    title: "Flexibilidade de Horários",
    descrição:
      "Oferece maior flexibilidade para agendar sessões, permitindo encaixar os atendimentos em horários mais convenientes, como à noite ou nos fins de semana.",
    Icon: <FaClock />, // Simboliza o controle de tempo e horários flexíveis
    brColor: "#73bc00",
    delay: 0.6,
  },

  {
    id: 3,
    title: "Economia de Tempo e Custo",
    descrição:
      "Sem a necessidade de deslocamento, você economiza tempo e dinheiro com transporte. Além disso, a terapia online muitas vezes é mais acessível financeiramente.",
    Icon: <FaMoneyBillWave />, // Representa economia de dinheiro e tempo
    brColor: "#fa6400",
    delay: 0.9,
  },

  {
    id: 4,
    title: "Privacidade e Conforto",
    descrição:
      "Permite realizar as sessões em um ambiente confortável e seguro para você, garantindo maior privacidade e liberdade para expressar seus sentimentos.",
    Icon: <FaLock />, // Simboliza segurança e privacidade
    brColor: "#fe6baa",
    delay: 0.9,
  },
];

const WhyChooseUs = () => {
  return (
    <div id="vantagens"  className="bg-[#f9f9f9]">
      <div className="container py-24">
        {/* header section */}
        <div className="spacey-y-4 p-6 text-center max-w-[500px] mx-auto mb-5">
          <h1 className="uppercase font-semibold text-orange-600">
          Por que nos escolher?
          </h1>
          <p className="font-semibold text-3xl">
          Vantagens da Nossa plataforma
          </p>
        </div>
        {/* cads section */}
        <div
          className="grid grid-cols-2-1 sm:grid-cols-2 md:grid-cols-2
      md:grid-cols-4 gap-6
      "
        >
          {WhyChooseData.map((item) => {
            return (
              <motion.div
              variants={SlideLeft(item.delay)}
              initial="hidden"
              whileInView={"visible"}
              className="space-y-4 p-6 rounded-xl shadow-[0_0_22px_rgba(0,0,0,0.15)]">
                {/* icon section */}
                <div style={{background: item.brColor}} className="w-10 h-10 rounded-lg flex justify-center items-center text-white">

                  <div className="text-2xl">{item.Icon}</div>
                </div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-500">{item.descrição}</p>
             </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
