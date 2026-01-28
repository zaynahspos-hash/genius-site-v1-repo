import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
import { SEO } from '../common/SEO';

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
  const { settings: globalSettings } = useSettings();
  const settings = previewSettings || globalSettings;
  const sections = settings?.homepage?.sections || [];

  return (
    <div className="animate-in fade-in duration-500">
      <SEO 
        title={settings?.general?.storeName}
        description={settings?.seo?.metaDescription || "Welcome to our premium store"}
        type="website"
      />

      {sections.map((section: any, index: number) => {
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

      {sections.length === 0 && (
          <div className="py-20 text-center">
              <h2 className="text-2xl font-bold text-gray-300">No sections configured</h2>
              <p className="text-gray-400">Go to Admin {" > "} Homepage to customize your store.</p>
          </div>
      )}
    </div>
  );
};