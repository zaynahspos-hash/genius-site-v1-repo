import React from 'react';
import { Truck, RefreshCw, ShieldCheck, Headphones, CreditCard, Star, Box, Zap } from 'lucide-react';

const icons: any = { Truck, RefreshCw, ShieldCheck, Headphones, CreditCard, Star, Box, Zap };

interface FeaturesProps {
  settings: {
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    style?: 'icons' | 'cards' | 'minimal';
    backgroundColor?: string;
  };
}

export const FeaturesSection: React.FC<FeaturesProps> = ({ settings }) => {
  const items = settings?.items || [];
  const style = settings?.style || 'icons';
  const bgColor = settings?.backgroundColor || '#ffffff';

  if (items.length === 0) return null;

  return (
    <section className="py-12 border-b border-gray-100" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${style === 'cards' ? 'gap-y-8' : ''}`}>
          {items.map((item, i) => {
            const Icon = icons[item.icon] || icons['Star'];
            
            if (style === 'cards') {
                return (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                        <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                            <Icon size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                );
            }

            // Default 'icons' style
            return (
              <div key={i} className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};