import React, { useState } from 'react';
import { X } from 'lucide-react';

interface GalleryProps {
  settings: {
    title?: string;
    images: string[];
    columns?: number;
    aspectRatio?: 'square' | 'video' | 'portrait';
    gap?: 'none' | 'small' | 'medium';
  };
}

export const GallerySection: React.FC<GalleryProps> = ({ settings }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const cols = settings.columns || 4;
  const gap = settings.gap === 'none' ? 'gap-0' : settings.gap === 'small' ? 'gap-2' : 'gap-4';
  const aspect = settings.aspectRatio === 'video' ? 'aspect-video' : settings.aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square';

  return (
    <section className="py-12">
      {settings.title && (
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">{settings.title}</h2>
        </div>
      )}
      
      <div className={`max-w-7xl mx-auto px-4`}>
        <div className={`grid grid-cols-2 md:grid-cols-${cols} ${gap}`}>
          {settings.images?.map((img, idx) => (
            <div 
              key={idx} 
              className={`${aspect} relative group cursor-zoom-in overflow-hidden ${settings.gap !== 'none' ? 'rounded-lg' : ''}`}
              onClick={() => setLightboxImage(img)}
            >
              <img 
                src={img} 
                alt={`Gallery ${idx}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white">
            <X size={32} />
          </button>
          <img src={lightboxImage} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </section>
  );
};