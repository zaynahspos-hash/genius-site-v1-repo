import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BannerProps {
  settings: {
    items: Array<{
      image: string;
      title: string;
      subtitle?: string;
      buttonText?: string;
      buttonLink?: string;
      overlayColor?: string; // hex
      textColor?: string;
    }>;
    columns?: number; // 1, 2, 3
    height?: 'auto' | 'small' | 'medium';
  };
}

export const BannerSection: React.FC<BannerProps> = ({ settings }) => {
  const navigate = useNavigate();
  const items = settings?.items || [];
  const cols = settings?.columns || 2;
  const heightClass = settings?.height === 'small' ? 'h-[300px]' : settings?.height === 'medium' ? 'h-[450px]' : 'h-auto aspect-[16/9]';

  if (items.length === 0) return null;

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-8`}>
            {items.map((item, idx) => (
                <div key={idx} className={`relative ${heightClass} rounded-2xl overflow-hidden group w-full`}>
                    <img 
                        src={item.image || 'https://via.placeholder.com/800x600'} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div 
                        className="absolute inset-0 flex flex-col justify-center items-start p-10 transition-colors"
                        style={{ backgroundColor: item.overlayColor || 'rgba(0,0,0,0.2)' }}
                    >
                        {item.subtitle && (
                            <span className="font-bold tracking-widest text-xs uppercase mb-3" style={{ color: item.textColor || '#fff', opacity: 0.9 }}>
                                {item.subtitle}
                            </span>
                        )}
                        <h3 className="text-3xl md:text-4xl font-bold mb-6 max-w-xs" style={{ color: item.textColor || '#fff' }}>
                            {item.title}
                        </h3>
                        {item.buttonText && (
                            <button 
                                onClick={() => navigate(item.buttonLink || '/shop')}
                                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-colors"
                            >
                                {item.buttonText}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
};