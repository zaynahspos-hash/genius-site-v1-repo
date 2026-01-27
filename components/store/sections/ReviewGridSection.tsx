
import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReviewGridProps {
  settings: {
    title?: string;
    subtitle?: string;
    layout?: 'grid' | 'masonry';
    starColor?: string;
    cardColor?: string;
    textColor?: string;
    backgroundColor?: string;
    reviews?: Array<{
      author: string;
      productName: string;
      productImage: string;
      rating: number;
      text: string;
      date: string;
      productId: string;
    }>;
  };
}

// Mock data if none provided (for preview)
const MOCK_REVIEWS = [
    { id: 1, author: "Sarah J.", productName: "Luxe Chronograph Watch", productImage: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400", rating: 5, text: "Absolutely stunning watch. The weight feels premium and it looks even better in person.", date: "2 days ago", productId: "1" },
    { id: 2, author: "Mike T.", productName: "Sony Headphones", productImage: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=400", rating: 5, text: "Best noise cancelling I've ever experienced. Shipping was super fast too!", date: "1 week ago", productId: "2" },
    { id: 3, author: "Jessica L.", productName: "Organic Cotton Tee", productImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400", rating: 4, text: "Very soft material. Fits slightly large so maybe size down, but great quality.", date: "2 weeks ago", productId: "3" },
    { id: 4, author: "David B.", productName: "Mid-Century Armchair", productImage: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=400", rating: 5, text: "Looks exactly like the photos. Very easy to assemble.", date: "3 weeks ago", productId: "4" }
];

export const ReviewGridSection: React.FC<ReviewGridProps> = ({ settings }) => {
  const navigate = useNavigate();
  const reviews = settings.reviews && settings.reviews.length > 0 ? settings.reviews : MOCK_REVIEWS;
  
  const styles = {
      section: { backgroundColor: settings.backgroundColor || '#ffffff' },
      card: { backgroundColor: settings.cardColor || '#f9fafb' },
      text: { color: settings.textColor || '#111827' },
      subText: { color: settings.textColor ? `${settings.textColor}99` : '#6b7280' }, // 99 for opacity
      star: { color: settings.starColor || '#fbbf24' } // Default amber-400
  };

  return (
    <section className="py-16 md:py-24" style={styles.section}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(settings.title || settings.subtitle) && (
            <div className="text-center mb-12">
                {settings.title && <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[Poppins]" style={styles.text}>{settings.title}</h2>}
                {settings.subtitle && <p className="text-lg max-w-2xl mx-auto" style={styles.subText}>{settings.subtitle}</p>}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review: any, idx) => (
                <div 
                    key={idx} 
                    onClick={() => navigate(`/product/${review.productId}`)}
                    className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col h-full border border-transparent hover:border-gray-100"
                    style={styles.card}
                >
                    {/* Header: Product + Rating */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <img src={review.productImage} alt={review.productName} className="w-12 h-12 rounded-lg object-cover border border-black/5" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase tracking-wider mb-1 line-clamp-1" style={styles.subText}>{review.productName}</span>
                                <div className="flex">
                                    {[1,2,3,4,5].map(s => (
                                        <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} style={{ color: s <= review.rating ? styles.star.color : '#e5e7eb' }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="flex-1 mb-6 relative">
                        <Quote size={24} className="absolute -top-2 -left-1 opacity-10 transform -scale-x-100" style={styles.text} />
                        <p className="text-sm leading-relaxed relative z-10 pl-2" style={styles.text}>
                            "{review.text}"
                        </p>
                    </div>

                    {/* Footer: Author */}
                    <div className="pt-4 border-t border-black/5 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                {review.author.charAt(0)}
                            </div>
                            <span className="text-xs font-bold" style={styles.text}>{review.author}</span>
                            <CheckCircle size={12} className="text-green-500" />
                        </div>
                        <span className="text-[10px]" style={styles.subText}>{review.date}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};
