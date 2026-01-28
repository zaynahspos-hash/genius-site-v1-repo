import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, CheckCircle, Image as ImageIcon, X, Camera, PenTool, AlertCircle } from 'lucide-react';
import { reviewService } from '../../../services/reviewService';
import { customerService } from '../../../services/customerService';
import { productService } from '../../../services/productService'; // Reuse upload

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [sort, setSort] = useState('newest');
  
  // Form State
  const [form, setForm] = useState({ rating: 5, title: '', comment: '', images: [] as string[] });
  const [uploading, setUploading] = useState(false);

  const user = customerService.getCurrentUser();

  useEffect(() => {
    fetchReviews();
  }, [productId, sort]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
        const data = await reviewService.getProductReviews(productId, { sort });
        // SAFETY CHECK: Ensure reviews is an array before setting
        setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
        setBreakdown(data?.breakdown || {});
        setTotal(data?.total || 0);
    } catch(e) { 
        console.error("Review fetch error:", e);
        setReviews([]); // Fallback to empty array
    } 
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) { alert('Please login first'); return; }
      try {
          await reviewService.createReview({ ...form, productId });
          alert('Review submitted for approval!');
          setShowForm(false);
          setForm({ rating: 5, title: '', comment: '', images: [] });
      } catch(e) { alert('Failed to submit review'); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          setUploading(true);
          try {
              const url = await productService.uploadImage(e.target.files[0]);
              setForm(prev => ({ ...prev, images: [...prev.images, url] }));
          } catch(e) { alert('Upload failed'); }
          finally { setUploading(false); }
      }
  };

  const handleHelpful = async (id: string) => {
      await reviewService.markHelpful(id);
      // Optimistic update
      setReviews(prev => prev.map(r => r._id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r));
  };

  const StarRating = ({ rating, size = 16, interactive = false, onChange }: any) => (
      <div className="flex gap-1">
          {[1,2,3,4,5].map(star => (
              <Star 
                key={star} 
                size={size} 
                fill={star <= rating ? "#fbbf24" : "none"} 
                className={`${star <= rating ? "text-amber-400" : "text-gray-300"} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                onClick={() => interactive && onChange && onChange(star)}
              />
          ))}
      </div>
  );

  return (
    <div id="reviews" className="py-12 border-t border-gray-100">
        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Breakdown */}
            <div className="lg:w-1/3 space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 min-w-[140px]">
                        <span className="text-5xl font-bold text-gray-900">{breakdown?.avg?.toFixed(1) || '0.0'}</span>
                        <div className="flex mt-2 mb-1"><StarRating rating={breakdown?.avg || 0} /></div>
                        <span className="text-xs text-gray-500">{total} Reviews</span>
                    </div>
                    <div className="flex-1 space-y-2">
                        {[5,4,3,2,1].map(stars => {
                            const count = breakdown?.[['one','two','three','four','five'][stars-1]] || 0;
                            const percent = total > 0 ? (count / total) * 100 : 0;
                            return (
                                <div key={stars} className="flex items-center gap-3 text-sm">
                                    <span className="w-3">{stars}</span>
                                    <Star size={12} className="text-gray-400" />
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }}></div>
                                    </div>
                                    <span className="w-8 text-right text-gray-500">{Math.round(percent)}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <button 
                    onClick={() => user ? setShowForm(true) : alert('Please login to review')}
                    className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                    Write a Review
                </button>
            </div>

            {/* List */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h4 className="font-bold text-gray-900">{total} Reviews</h4>
                    <select className="border-none text-sm font-medium focus:ring-0 cursor-pointer text-gray-600" value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="newest">Most Recent</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                        <option value="helpful">Most Helpful</option>
                    </select>
                </div>

                {reviews.length === 0 && <p className="text-gray-500 text-center py-10">No reviews yet. Be the first!</p>}

                <div className="space-y-8">
                    {reviews.map(review => (
                        <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-sm">
                                        {review.user?.name?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900 text-sm">{review.user?.name || 'Anonymous'}</h5>
                                        {review.isVerifiedPurchase && (
                                            <span className="text-xs text-green-600 flex items-center gap-1">
                                                <CheckCircle size={10} /> Verified Purchase
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="mb-2"><StarRating rating={review.rating} size={14} /></div>
                            <h5 className="font-bold text-gray-900 mb-1">{review.title}</h5>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>
                            
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mb-4">
                                    {review.images.map((img: string, i: number) => (
                                        <img key={i} src={img} className="w-16 h-16 object-cover rounded-lg border border-gray-100 cursor-zoom-in" />
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <button onClick={() => handleHelpful(review._id)} className="text-xs text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                                    <ThumbsUp size={14} /> Helpful ({review.helpfulCount || 0})
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Modal Form */}
        {showForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Write a Review</h3>
                        <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <StarRating rating={form.rating} size={24} interactive onChange={(r: number) => setForm({...form, rating: r})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Review Title</label>
                            <input required className="w-full border rounded-lg px-3 py-2" placeholder="Summarize your experience" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Review</label>
                            <textarea required className="w-full border rounded-lg px-3 py-2" rows={4} placeholder="What did you like or dislike?" value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Photos</label>
                            <div className="flex gap-2 items-center">
                                {form.images.map((img, i) => (
                                    <div key={i} className="relative w-16 h-16">
                                        <img src={img} className="w-full h-full object-cover rounded-lg" />
                                        <button type="button" onClick={() => setForm(p => ({...p, images: p.images.filter((_, idx) => idx !== i)}))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
                                    </div>
                                ))}
                                <label className="w-16 h-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                                </label>
                            </div>
                        </div>
                        <button disabled={uploading} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-900">Submit Review</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};