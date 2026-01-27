import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CountdownProps {
  settings: {
    targetDate: string;
    heading: string;
    subheading?: string;
    backgroundImage?: string;
    backgroundColor?: string;
    textColor?: string;
    buttonText?: string;
    buttonLink?: string;
  };
}

export const CountdownSection: React.FC<CountdownProps> = ({ settings }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(settings.targetDate).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.targetDate]);

  const style = {
    backgroundColor: settings.backgroundColor || '#111827',
    backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : 'none',
    color: settings.textColor || '#ffffff',
  };

  return (
    <section className="py-20 bg-cover bg-center bg-no-repeat relative" style={style}>
      {settings.backgroundImage && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">{settings.heading}</h2>
        {settings.subheading && <p className="text-lg opacity-90 mb-12">{settings.subheading}</p>}
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="text-4xl md:text-6xl font-bold mb-2 tabular-nums">
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-widest opacity-70">{unit}</div>
            </div>
          ))}
        </div>

        {settings.buttonText && (
          <button 
            onClick={() => navigate(settings.buttonLink || '/shop')}
            className="bg-white text-black px-8 py-3.5 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            {settings.buttonText}
          </button>
        )}
      </div>
    </section>
  );
};