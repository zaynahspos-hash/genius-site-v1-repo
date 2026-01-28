import React from 'react';
import { Product } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
import { SEO } from '../common/SEO';
import { Loader2, AlertCircle } from 'lucide-react';

// Sections
import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { ProductGridSection } from './sections/ProductGridSection';
import { BannerSection } from './sections/BannerSection';
import { VideoSection } from './sections/VideoSection';
import { CountdownSection } from './sections/CountdownSection';
import { FAQSection } from './sections/FAQSection';
import { GallerySection } from './sections/GallerySection';
import { TeamSection } from './sections/TeamSection';
import { StatsSection } from './sections/StatsSection';
import { MapSection } from './sections/MapSection';
import { ReviewGridSection } from './sections/ReviewGridSection';

interface StoreHomeProps {
  addToCart: (p: Product) => void;
  previewSettings?: any;
}

export const StoreHome: React.FC<StoreHomeProps> = ({ addToCart, previewSettings }) => {
  const { settings: globalSettings, loading, error } = useSettings() as any;
  const settings = previewSettings || globalSettings;
  const sections = settings?.homepage?.sections || [];

  if (loading && !previewSettings) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-indigo-600" size={40} />
              <p className="text-gray-500 font-medium animate-pulse">Loading your store...</p>
          </div>
      );
  }

  if (error && !previewSettings) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-gray-500 max-w-sm">We couldn't load the store content. Please try refreshing the page.</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
              >
                  Retry
              </button>
          </div>
      );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <SEO 
        title={settings?.general?.storeName}
        description={settings?.seo?.metaDescription || "Welcome to our premium store"}
        type="website"
      />

      {sections.map((section: any) => {
          if (!section.enabled) return null;

          switch(section.type) {
              case 'hero': return <HeroSection key={section.id} settings={section.settings} />;
              case 'features': return <FeaturesSection key={section.id} settings={section.settings} />;
              case 'products': return <ProductGridSection key={section.id} settings={section.settings} addToCart={addToCart} />;
              case 'banner': return <BannerSection key={section.id} settings={section.settings} />;
              case 'video': return <VideoSection key={section.id} settings={section.settings} />;
              case 'countdown': return <CountdownSection key={section.id} settings={section.settings} />;
              case 'faq': return <FAQSection key={section.id} settings={section.settings} />;
              case 'gallery': return <GallerySection key={section.id} settings={section.settings} />;
              case 'team': return <TeamSection key={section.id} settings={section.settings} />;
              case 'stats': return <StatsSection key={section.id} settings={section.settings} />;
              case 'map': return <MapSection key={section.id} settings={section.settings} />;
              case 'reviews-grid': return <ReviewGridSection key={section.id} settings={section.settings} />;
              default: return null;
          }
      })}

      {sections.length === 0 && !loading && (
          <div className="py-32 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <AlertCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-400">Your homepage is empty</h2>
              <p className="text-gray-500 max-w-xs">Use the admin customizer to add sections like Hero banners and Product grids.</p>
          </div>
      )}
    </div>
  );
};
