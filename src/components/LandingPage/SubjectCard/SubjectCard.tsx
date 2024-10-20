import React from 'react'
import { delay, motion } from "framer-motion";
import { FaBrain, FaSmile, FaComments, FaHeart, FaChild, FaUserFriends, FaMedkit, FaHandsHelping } from "react-icons/fa";
import { id } from 'date-fns/locale';


const SubjecList = [
    {
        id: 1,
        nome: "Terapia Cognitivo-Comportamental",
        icon: <FaBrain />,
        color: "#00c986",
        delay: 0.2,
    },

    {
        id: 2,
        nome: "Terapia Humanista",
        icon: <FaSmile />,
        color: "#2563eb",
        delay: 0.3,
    },

    {
        id: 3,
        nome: "Terapia Psicanalítica",
        icon: <FaComments />,
        color: "#922aee",
        delay: 0.4,
    },

    {
        id: 4,
        nome: "Terapia de Casal e Família",
        icon: <FaHeart />,
        color: "#ea7516",
        delay: 0.5,
    },

    {
        id: 5,
        nome: "Terapia Infantil",
        icon: <FaChild />,
        color: "#075267",
        delay: 0.6,
    },

    {
        id: 6,
        nome: "Terapia de Grupo",
        icon: <FaUserFriends />,
        color: "#986d1d",
        delay: 0.7,
    },
    {
        id: 7,
        nome: "Terapia Integrativa",
        icon: <FaMedkit />,
        color: "#b93838",
        delay: 0.8,
    },
    {
        id: 8,
        nome: "Terapia de Apoio",
        icon: <FaHandsHelping />,
        color: "#464646",
        delay: 0.9,
    },
];


const SubjectCard = () => {
  return (
    <>
        <div id='servicos' className="container py-14 md:py-24">
            <div>
                {/* header section */}
                <div className='space-y-4 p-6 text-center max-w-[600px] mx-auto mb-5'>
                    <h1 className='uppercase font-semibold text-center text-orange-500'>Nossos serviços</h1>
                    <p className='font-semibold text-3xl'>Principais Abordagens Terapêuticas</p>
                </div>

                {/* cards section */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                    {
                        SubjecList.map((Subject) =>{
                            return(
                                <motion.div
                                key={Subject.id}
                                initial={{ opacity: 0, x: -200 }} 
                                whileInView={{ opacity: 1, x:0 }}
                                transition={{ type: "spring", stiffness: 100, delay: Subject.delay }}


                                className='border rounded-lg border-borda p-4 flex justify-start items-center gap-4 hover:!scale-105 hover:!shadow-xl duration-200 cursor-pointer'>
                                    
                                    <div style={ {color: Subject.color, backgroundColor: Subject.color + "20"}}
                                    className='w-10 h-10 rounded-md flex justify-center items-center'>{Subject.icon}</div>
                                    <p>{Subject.nome}</p>
                                </motion.div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    </>
  )
}

export default SubjectCard