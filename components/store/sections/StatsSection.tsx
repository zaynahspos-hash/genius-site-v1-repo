import React from 'react';

interface StatsProps {
  settings: {
    backgroundColor?: string;
    items: Array<{
      label: string;
      value: string;
      suffix?: string;
    }>;
  };
}

export const StatsSection: React.FC<StatsProps> = ({ settings }) => {
  return (
    <section className="py-20" style={{ backgroundColor: settings.backgroundColor || '#4f46e5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {settings.items?.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                {item.value}<span className="text-white/60 text-3xl">{item.suffix}</span>
              </div>
              <div className="text-white/80 font-medium text-sm md:text-base uppercase tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};