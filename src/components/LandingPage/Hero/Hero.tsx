
import { useNavigate } from 'react-router-dom';
import HeroImg from "../../../assets/3d-calendar.png";
import { FaPlay } from 'react-icons/fa';
import { motion } from "framer-motion";
import SlideRight from "../../../utility/animation"


 const Hero = () => {

    const navigate = useNavigate();
    const handleLoginClick = () => {
      navigate("/EventList");
    };

  return (
    <>
    <div id="inicio" className='container grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative'>
        {/* brand info */}
        <div className='flex flex-col justify-center py-14 md:pr-16 xl:pr-40 md:py-0'>
            <div className="text-center md:text-left space-y-4 ">
                <motion.p
                variants={SlideRight(0.4)}
                initial="hidden"
                animate="visible"
                className='text-orange-600 uppercase  font-semibold'>Garantia de 100% de satisfação</motion.p>

                <motion.h1
                variants={SlideRight(0.6)}
                initial="hidden"
                animate="visible"
                
                className=' text-5xl font-semibold lg:text-6xl !leading-tight'>Escolha seu melhor<span className='text-one'> horário</span></motion.h1>
                <motion.p
                 variants={SlideRight(0.8)}
                 initial="hidden"
                 animate="visible"
                >Nós ajudamos você a agendar consultas com o psicólogo ideal, no melhor horário para você. Com flexibilidade e facilidade</motion.p>
                {/* button section */}

                <motion.div
                 variants={SlideRight(1.0)}
                 initial="hidden"
                 animate="visible"

                className='flex gap-8 justify-center
                md:justify-start !mt-8 items-center
                '>

                <button className='primary-btn'
                    onClick={handleLoginClick}
                >Disponibilidade
                </button>

                <button className='flex justify-end items-center  gap-2 font-semibold'>
                  <span className='w-10 h-10 bg-slate-400 rounded-full flex justify-center
                 
                  items-center items-center
                  '>
                    <FaPlay className='text-two'/>
                  </span>
                  Como funciona</button>

                </motion.div>

                
            </div>
        </div>
        {/* hero image */}
        <div className='flex justify-center items-center'>
          <motion.img
          initial={{ opacity: 0, x: -200}}
          animate={{ opacity: 1, x: 0}}
          transition={{ type: "spring", stiffness: 100, delay:0.2}}
        src={HeroImg} 
        alt="Hero" 
        className='w-[600px] md:w-[550]  xl:w-[700]'/>
        </div>
        {/* brand info */}
    </div>
    </>
  )
}

export default Hero
