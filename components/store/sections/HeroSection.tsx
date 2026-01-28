import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  settings: {
    slides: Array<{
      image: string;
      mobileImage?: string;
      tagline?: string;
      heading: string;
      description?: string;
      buttonText?: string;
      buttonLink?: string;
      textPosition?: 'left' | 'center' | 'right';
      overlayOpacity?: number;
    }>;
    height?: 'full' | 'large' | 'medium';
    autoplay?: boolean;
    autoplaySpeed?: number;
  };
}

export const HeroSection: React.FC<HeroProps> = ({ settings }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const slides = settings?.slides || [];
  
  const heightClass = settings.height === 'full' ? 'h-[85vh]' : settings.height === 'large' ? 'h-[600px]' : 'h-[400px]';

  useEffect(() => {
    if (settings.autoplay && slides.length > 1) {
      const timer = setInterval(() => {
        setCurrent(prev => (prev + 1) % slides.length);
      }, (settings.autoplaySpeed || 5) * 1000);
      return () => clearInterval(timer);
    }
  }, [settings.autoplay, settings.autoplaySpeed, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className={`relative w-full overflow-hidden bg-gray-900 ${heightClass}`}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
             <img 
                src={slide.image || 'https://placehold.co/1920x800/222/fff?text=Hero+Image'} 
                className="w-full h-full object-cover" 
                alt={slide.heading}
             />
             <div 
                className="absolute inset-0 bg-black transition-opacity duration-500" 
                style={{ opacity: (slide.overlayOpacity || 40) / 100 }} 
             />
          </div>

          {/* Content */}
          <div className={`absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12
              ${slide.textPosition === 'left' ? 'items-start text-left' : 
                slide.textPosition === 'right' ? 'items-end text-right' : 
                'items-center text-center'}`}
          >
              <div className={`max-w-2xl transition-all duration-1000 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  {slide.tagline && (
                      <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-white/90 text-xs tracking-[0.2em] uppercase mb-4 backdrop-blur-sm">
                          {slide.tagline}
                      </span>
                  )}
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                      {slide.heading}
                  </h2>
                  {slide.description && (
                      <p className="text-lg text-gray-200 mb-8 font-light leading-relaxed">
                          {slide.description}
                      </p>
                  )}
                  {slide.buttonText && (
                      <button 
                        onClick={() => navigate(slide.buttonLink || '/shop')}
                        className="bg-white text-black px-8 py-3.5 rounded-full font-medium hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg"
                      >
                          {slide.buttonText}
                      </button>
                  )}
              </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      {slides.length > 1 && (
          <>
            <button 
                onClick={() => setCurrent(c => (c - 1 + slides.length) % slides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={() => setCurrent(c => (c + 1) % slides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
            >
                <ChevronRight size={24} />
            </button>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {slides.map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                    />
                ))}
            </div>
          </>
      )}
    </div>
  );
};