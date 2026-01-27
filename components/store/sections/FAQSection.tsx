import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQProps {
  settings: {
    title: string;
    subtitle?: string;
    items: Array<{ question: string; answer: string }>;
    layout?: 'simple' | 'boxed';
  };
}

export const FAQSection: React.FC<FAQProps> = ({ settings }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{settings.title}</h2>
          {settings.subtitle && <p className="text-gray-500">{settings.subtitle}</p>}
        </div>

        <div className="space-y-4">
          {settings.items?.map((item, idx) => (
            <div 
              key={idx} 
              className={`overflow-hidden transition-all ${
                settings.layout === 'boxed' 
                  ? 'border border-gray-200 rounded-xl' 
                  : 'border-b border-gray-100'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className={`w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors ${
                  openIndex === idx ? 'bg-gray-50' : ''
                }`}
              >
                <span className="font-medium text-gray-900 text-lg">{item.question}</span>
                {openIndex === idx ? <ChevronUp className="text-indigo-600" /> : <ChevronDown className="text-gray-400" />}
              </button>
              <div 
                className={`px-6 text-gray-600 leading-relaxed transition-all duration-300 ease-in-out ${
                  openIndex === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};