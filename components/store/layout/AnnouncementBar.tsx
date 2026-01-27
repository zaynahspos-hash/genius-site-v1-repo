import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../../../contexts/SettingsContext';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useSettings();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const closed = localStorage.getItem('announcement_closed');
    if (closed) setVisible(false);
  }, []);

  const handleClose = () => {
      setVisible(false);
      localStorage.setItem('announcement_closed', 'true');
  };

  if (!visible || !settings?.homepage?.announcementBar?.enabled) return null;

  const { text, link } = settings.homepage.announcementBar;

  return (
    <div className="relative h-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden z-50">
        <div className="absolute inset-0 flex items-center">
            <div className="animate-marquee whitespace-nowrap font-medium text-sm tracking-wide">
                {text} &nbsp;&bull;&nbsp; {text} &nbsp;&bull;&nbsp; {text} &nbsp;&bull;&nbsp; {text}
            </div>
        </div>
        
        {/* Overlay Link */}
        {link && <a href={link} className="absolute inset-0 z-10" />}

        <button 
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white z-20 transition-colors"
        >
            <X size={14} />
        </button>
    </div>
  );
};