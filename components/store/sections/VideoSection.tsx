import React from 'react';

interface VideoSectionProps {
  settings: {
    videoUrl: string;
    title?: string;
    subtitle?: string;
    coverImage?: string;
    autoPlay?: boolean;
    height?: 'small' | 'medium' | 'large';
  };
}

export const VideoSection: React.FC<VideoSectionProps> = ({ settings }) => {
  const { videoUrl, title, subtitle, height = 'medium' } = settings;

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${id}?autoplay=${settings.autoPlay ? 1 : 0}&mute=${settings.autoPlay ? 1 : 0}`;
    }
    if (url.includes('vimeo.com')) {
      const id = url.split('/').pop();
      return `https://player.vimeo.com/video/${id}?autoplay=${settings.autoPlay ? 1 : 0}`;
    }
    return url;
  };

  const heightClass = height === 'small' ? 'h-[400px]' : height === 'large' ? 'h-[80vh]' : 'h-[600px]';

  return (
    <section className="relative w-full bg-black overflow-hidden">
      <div className={`relative w-full ${heightClass}`}>
        {videoUrl ? (
          <iframe
            src={getEmbedUrl(videoUrl)}
            className="w-full h-full object-cover"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
            No video URL provided
          </div>
        )}
        
        {(title || subtitle) && (
          <div className="absolute inset-0 bg-black/30 pointer-events-none flex flex-col items-center justify-center text-center p-6">
             {title && <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{title}</h2>}
             {subtitle && <p className="text-xl text-white/90 max-w-2xl drop-shadow-md">{subtitle}</p>}
          </div>
        )}
      </div>
    </section>
  );
};