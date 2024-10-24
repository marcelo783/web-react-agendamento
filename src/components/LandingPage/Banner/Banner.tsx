
import { motion } from "framer-motion";
import SlideUp from "../../../utility/animation"
import { FC } from "react";

type BannerProps = {
  image: string;
  title: string;
  Subtitle: string;
  link?: string;
  tag?: string;
  reverse?: boolean;
};

const Banner: FC<BannerProps>  = ({ image, title, Subtitle, tag, reverse }) => {
  return (
    <div id="sobre" className=" bg-[#f9f9f1] pb-14">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 space-y-6 md:space-y-0">
          {/* banner imag section */}
          <div
            className={`flex justify-start items-center ${
              reverse && "md:order-last md:justify-end"
            }`}
          >
            <motion.img
            initial={{ opacity: 0 , scale: 0.5 }}
            whileInView={{ opacity: 1, scale:1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            src={image} alt="" className="w-[400px] h-full object-cover" />
          </div>

          {/* Banner text sectiom */}

          <div className="flex flex-col justify-center text-center md:text-left space-y-4 lg:max-w-[500px]">
            <motion.p
            variants={SlideUp(0.5)}
            initial="hidden"
            whileInView={"visible"}

            className="text-sm text-orange-600 font-semibold capitalize">
              {tag}
            </motion.p>

            <motion.p
            variants={SlideUp(0.7)}
            initial="hidden"
            whileInView={"visible"}

            className="text-xl lg:text-2xl font-semibold capitalize ">
              {title}
            </motion.p>
            <motion.p
            variants={SlideUp(0.9)}
            initial="hidden"
            whileInView={"visible"}

            className="text-sm text-slate-500">{Subtitle}</motion.p>
            <motion.div 
            variants={SlideUp(1.1)}
            initial="hidden"
            whileInView={"visible"} 
            
            className="flex justify-center md:justify-start">
              {/* <button className="primary-btn !mt-5">Get Started</button> */}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
