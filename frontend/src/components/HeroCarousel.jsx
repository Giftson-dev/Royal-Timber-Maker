import React, { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';

const defaultImages = [
  {
    image: '/assets/images/hero-1.webp',
    text_line_1: 'Authentic',
    highlight_text: 'Locally Made',
    text_line_3: 'Furniture.'
  },
  {
    image: '/assets/images/hero-2.webp',
    text_line_1: 'Crafted',
    highlight_text: 'With Passion',
    text_line_3: 'For You.'
  },
  {
    image: '/assets/images/hero-3.webp',
    text_line_1: 'Timeless',
    highlight_text: 'Wooden Masterpieces',
    text_line_3: 'To Last.'
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/hero-images/')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setSlides(data);
        } else {
          setSlides(defaultImages);
        }
      })
      .catch(err => {
        console.error("Could not fetch hero images", err);
        setSlides(defaultImages);
      });
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[90vh] bg-black overflow-hidden flex flex-col justify-center font-sans">
      
      {/* Background Images with 7s Transition */}
      {slides.map((slide, index) => (
        <div
          key={`img-${index}`}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={`Royal Timber Makers Showcase ${index + 1}`}
            className="w-full h-full object-cover scale-105 transition-transform duration-[7000ms] ease-out"
            style={{ transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)' }}
            onError={(e) => {
              e.target.src = 'https://placehold.co/1920x1080/1a1a1a/333333?text=Your+WebP+Image+Here';
            }}
          />
        </div>
      ))}
      
      {/* Moody Dark Overlay Gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/60 to-black/30 pointer-events-none"></div>

      {/* Main Content Container - Dynamic Text Layers */}
      <div className="relative z-20 w-full h-full flex flex-col justify-center pointer-events-none px-6 lg:px-12 pb-20">
        <div className="relative w-full max-w-7xl mx-auto grid">
          
          {slides.map((slide, index) => (
            <div
              key={`text-${index}`}
              className={`col-start-1 row-start-1 transition-all duration-[1500ms] ease-in-out w-full max-w-3xl pointer-events-auto flex flex-col items-start text-left ${
                index === currentIndex 
                  ? 'opacity-100 translate-y-0 z-20' 
                  : 'opacity-0 translate-y-8 z-0'
              }`}
            >
              <h1 className="text-white flex flex-col leading-[1.1] tracking-tight mb-8">
                {slide.text_line_1 && (
                  <span className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold">
                    {slide.text_line_1}
                  </span>
                )}
                {slide.highlight_text && (
                  <span className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-outline">
                    {slide.highlight_text}
                  </span>
                )}
                {slide.text_line_3 && (
                  <span className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold">
                    {slide.text_line_3}
                  </span>
                )}
              </h1>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-start gap-8">
                <a 
                  href="#shop" 
                  className="group flex items-center gap-3 px-8 py-4 bg-rtm-coral text-white text-sm font-bold tracking-[0.2em] uppercase rounded-sm shadow-[0_0_20px_rgba(224,109,83,0.4)] hover:shadow-[0_0_30px_rgba(224,109,83,0.6)] hover:bg-rtm-coral/90 hover:-translate-y-1 transition-all duration-300"
                  tabIndex={index === currentIndex ? 0 : -1}
                >
                  Shop Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
          
        </div>
      </div>

      {/* Bottom Metadata Blocks */}
      <div className="absolute bottom-10 left-6 lg:left-12 z-30 flex gap-4">
        {/* Products Count */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-sm flex items-center gap-3 cursor-pointer hover:bg-white/10 hover:shadow-lg hover:-translate-y-2 hover:border-white/20 transition-all duration-300">
          <span className="text-white font-bold text-lg">100+</span>
          <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Products</span>
        </div>
        
        {/* Rating */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-sm flex items-center gap-3 cursor-pointer hover:bg-white/10 hover:shadow-lg hover:-translate-y-2 hover:border-rtm-mustard/40 transition-all duration-300 group">
          <span className="text-white font-bold text-lg">4.9</span>
          <Star size={14} className="text-white fill-white group-hover:text-rtm-mustard group-hover:fill-rtm-mustard transition-colors duration-300" />
          <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Rating</span>
        </div>
      </div>

    </div>
  );
}
