import React, { useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  url?: string;
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image, 
  type = 'website', 
  url,
  schema 
}) => {
  const { settings } = useSettings();
  const storeName = settings?.general?.storeName || 'ShopGenius';
  const defaultDesc = settings?.seo?.metaDescription || settings?.general?.storeName;
  const defaultImage = settings?.seo?.ogImage || settings?.general?.logoUrl;
  
  // Format Title: "Page Title - Store Name"
  const fullTitle = title ? title.replace('{store_name}', storeName) : storeName;
  const finalTitle = fullTitle.includes(storeName) ? fullTitle : `${fullTitle} - ${storeName}`;
  
  const finalDesc = description || defaultDesc;
  const finalImage = image || defaultImage;
  const currentUrl = url || window.location.href;

  useEffect(() => {
    // 1. Update Title
    document.title = finalTitle;

    // 2. Update Meta Tags
    const updateMeta = (name: string, content: string | undefined, attribute: 'name' | 'property' = 'name') => {
        if (!content) return;
        let element = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attribute, name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    updateMeta('description', finalDesc);
    updateMeta('keywords', settings?.seo?.keywords?.join(', '));
    
    // OG Tags
    updateMeta('og:title', finalTitle, 'property');
    updateMeta('og:description', finalDesc, 'property');
    updateMeta('og:image', finalImage, 'property');
    updateMeta('og:url', currentUrl, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:site_name', storeName, 'property');
    if (settings?.seo?.facebookAppId) updateMeta('fb:app_id', settings.seo.facebookAppId, 'property');

    // Twitter
    updateMeta('twitter:card', settings?.seo?.twitterCard || 'summary_large_image');
    updateMeta('twitter:title', finalTitle);
    updateMeta('twitter:description', finalDesc);
    updateMeta('twitter:image', finalImage);

    // 3. Schema.org JSON-LD
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
    }
    
    const baseSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": storeName,
        "url": window.location.origin,
        "logo": settings?.general?.logoUrl
    };

    script.textContent = JSON.stringify(schema || baseSchema);

    // Cleanup not fully robust here for SPA but sufficient for purpose
  }, [finalTitle, finalDesc, finalImage, currentUrl, type, schema, settings]);

  return null;
};