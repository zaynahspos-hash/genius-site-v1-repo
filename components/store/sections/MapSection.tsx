import React from 'react';
import { MapPin } from 'lucide-react';

interface MapSectionProps {
  settings: {
    title: string;
    description?: string;
    address?: string;
    mapUrl?: string; // Embed URL
    height?: 'small' | 'medium' | 'large';
  };
}

export const MapSection: React.FC<MapSectionProps> = ({ settings }) => {
  const heightClass = settings.height === 'small' ? 'h-[300px]' : settings.height === 'large' ? 'h-[600px]' : 'h-[450px]';
  const mapSrc = settings.mapUrl || 
    `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(settings.address || 'San Francisco, CA')}`;

  // Fallback map if no API key or URL
  const showPlaceholder = !settings.mapUrl && mapSrc.includes('YOUR_API_KEY');

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{settings.title}</h2>
        {settings.description && <p className="text-gray-500 max-w-2xl mx-auto">{settings.description}</p>}
      </div>
      
      <div className={`w-full ${heightClass} bg-gray-100 relative`}>
        {showPlaceholder ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <MapPin size={48} className="mb-4" />
                <p className="text-lg font-medium">Map Configuration Required</p>
                <p className="text-sm">Please provide an Embed URL or Google Maps API Key in settings.</p>
                {settings.address && <p className="mt-4 text-gray-600 font-medium bg-white px-4 py-2 rounded shadow-sm">{settings.address}</p>}
            </div>
        ) : (
            <iframe 
                src={mapSrc} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        )}
      </div>
    </section>
  );
};