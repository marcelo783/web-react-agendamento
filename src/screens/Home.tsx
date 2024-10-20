import Hero from '@/components/LandingPage/Hero/Hero';
import Navbar from '@/components/LandingPage/Navbar/Navbar';
import NavbarBanner from '@/components/LandingPage/Navbar/NavbarBanner';
import NumberCounter from "@/components/LandingPage/NumberCouter/NumberCounter"
import WhyChooseUs from '@/components/LandingPage/WhyChooseUs/WhyChooseUs';
import { Subtitles } from 'lucide-react';
import { title } from 'process';
import React from 'react';
import Img1 from '../assets/banner1.png';
import Img2 from '../assets/banner2.png';
import Banner from '@/components/LandingPage/Banner/Banner';
import SubjectCard from '@/components/LandingPage/SubjectCard/SubjectCard';
import Testimonial from '@/components/LandingPage/Testimonial/Testimonial';
import Footer from '@/components/LandingPage/Footer/Footer';





const BannerData = {
  image: Img1,
  // tag: "CUSTOMIZE WITH YOUR SCHEDULE",
  title: "Missão",
  Subtitle: "Nossa missão é simplificar o acesso ao cuidado psicológico, conectando pessoas com profissionais qualificados de maneira rápida, intuitiva e acessível. Acreditamos que o bem-estar mental é essencial para uma vida equilibrada e saudável, e por isso nos dedicamos a facilitar o processo de agendamento de consultas com psicólogos, garantindo que mais pessoas possam receber o suporte emocional e psicológico de que precisam, no momento certo. ",
  link: "#",
}


const BannerData2 = {
  image: Img2,
  // tag: "CUSTOMIZE WITH YOUR SCHEDULE",
  title: "Valores",
  Subtitle: "Nossos valores são guiados por princípios sólidos que norteiam todas as nossas ações. A acessibilidade é um dos nossos pilares, pois acreditamos que o cuidado psicológico deve estar ao alcance de todos, independentemente de barreiras de tempo ou localização. Queremos garantir que qualquer pessoa possa encontrar o profissional certo para suas necessidades de forma simples e rápida. A empatia está no centro de tudo o que fazemos.",
  link: "#",
}


const Home: React.FC = () => {
//
  return (
    <main className="overflow-x-hidden">
     <Navbar/>
     <NavbarBanner/>
     <Hero/>
     <NumberCounter/>
     <WhyChooseUs/>
     <Banner {...BannerData} />
     <Banner {...BannerData2}  reverse={true}/>
     <SubjectCard/>
       {/* <Testimonial/> */}
     <Footer/>

   
    </main>
  );
};


export default Home;
