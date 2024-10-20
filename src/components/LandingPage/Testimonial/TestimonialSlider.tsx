import React, { useState, useEffect } from "react";

const TestimonialsData = [
  {
    id: 1,
    name: "John Doe",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Steve Smith",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Kristen",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 4,
    name: "Ariana",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://picsum.photos/103/103",
  },
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para calcular slides visíveis com base no tamanho da tela
  const getVisibleSlides = () => {
    if (window.innerWidth >= 1024) {
      return 3; // Mostra 3 slides em telas grandes
    } else if (window.innerWidth >= 768) {
      return 2; // Mostra 2 slides em tablets
    } else {
      return 1; // Mostra 1 slide em celulares
    }
  };

  const [visibleSlides, setVisibleSlides] = useState(getVisibleSlides);

  // Atualiza número de slides visíveis ao redimensionar a tela
  useEffect(() => {
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Função para avançar o slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === TestimonialsData.length - visibleSlides ? 0 : prevIndex + 1
    );
  };

  // Função para voltar o slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? TestimonialsData.length - visibleSlides : prevIndex - 1
    );
  };

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [visibleSlides]);

  return (
    <div className="py-14 mb-10">
      <div className="container">
        {/* Header */}
        <div className="space-y-4 p-6 text-center max-w-[600px] mx-auto mb-6">
          <h1 className="uppercase font-semibold text-orange-600">
            OUR TESTIMONIALS
          </h1>
          <p className="font-semibold text-3xl">
            What Our Students Say About Us
          </p>
        </div>

        {/* Slider Section */}
        <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
          {/* Slides */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
            }}
          >
            {TestimonialsData.map((item) => (
              <div
                key={item.id}
                className={`w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-4`}
              >
                <div className="flex flex-col gap-4 p-8 shadow-lg mx-4 rounded-xl bg-secondary/10">
                  {/* Top Section */}
                  <div className="flex justify-start items-center gap-5">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <p className="text-xl font-bold text-black/80">
                        {item.name}
                      </p>
                      <p>{item.name}</p>
                    </div>
                  </div>
                  {/* Bottom Section */}
                  <div className="py-6 space-y-4">
                    <p className="text-sm text-gray-500">{item.text}</p>
                    <p>⭐⭐⭐⭐⭐</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
          >
            ❯
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {Array.from({ length: TestimonialsData.length - visibleSlides + 1 }).map(
              (_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    index === currentIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                ></div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
