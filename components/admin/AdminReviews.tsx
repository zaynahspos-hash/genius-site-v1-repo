import React, { useEffect, useState } from 'react';
import { reviewService } from '../../services/reviewService';
import { Star, Check, X, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [status]);

  const fetchReviews = async () => {
      setLoading(true);
      setError('');
      try {
          const data = await reviewService.getAllReviews(status);
          
          // CRITICAL FIX: Ensure we extract the array correctly
          // The backend returns { reviews: [...], total: 0 }
          // If data is null/undefined, fallback to []
          if (data && Array.isArray(data.reviews)) {
              setReviews(data.reviews);
          } else if (Array.isArray(data)) {
              // Fallback if backend structure changes
              setReviews(data);
          } else {
              setReviews([]);
          }
      } catch(e: any) { 
          console.error("Review Fetch Error:", e);
          setError('Failed to load reviews. ' + (e.message || ''));
          setReviews([]); // Prevent crash by setting empty array
      } 
      finally { setLoading(false); }
  };

  const handleStatus = async (id: string, newStatus: string) => {
      try {
          await reviewService.updateStatus(id, newStatus);
          fetchReviews();
      } catch(e) { alert('Failed to update status'); }
  };

  const formatDate = (dateString: string) => {
      try {
          if (!dateString) return 'N/A';
          return new Date(dateString).toLocaleDateString();
      } catch (e) { return 'N/A'; }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reviews</h1>
            <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1 w-full sm:w-auto overflow-x-auto">
                {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <button 
                        key={s} 
                        onClick={() => setStatus(s)}
                        className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors whitespace-nowrap
                            ${status === s 
                                ? 'bg-indigo-600 text-white shadow-sm' 
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>

        {error && (
            <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle size={18}/> {error}
            </div>
        )}

        {loading ? (
            <div className="flex justify-center items-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        ) : (
            <>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Reviewer</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4 w-1/3">Comment</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {reviews.map(review => (
                                <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white max-w-[150px] truncate">
                                            {review.product?.title || 'Unknown Product'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{review.user?.name || 'Anonymous'}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(review.createdAt)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex text-amber-400">
                                            {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} className={s <= review.rating ? "" : "text-gray-300 dark:text-gray-600"} />)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{review.comment}</p>
                                        {review.images?.length > 0 && <span className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mt-1"><MessageSquare size={10}/> Has Photos</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold capitalize 
                                            ${review.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                            review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {review.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {review.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleStatus(review._id, 'approved')} className="p-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded hover:bg-green-100"><Check size={16}/></button>
                                                    <button onClick={() => handleStatus(review._id, 'rejected')} className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100"><X size={16}/></button>
                                                </>
                                            )}
                                            {review.status !== 'pending' && (
                                                <button onClick={() => handleStatus(review._id, 'pending')} className="text-xs underline text-gray-500 dark:text-gray-400">Reset</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>

                {reviews.length === 0 && <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">No reviews found.</div>}
            </>
        )}
    </div>
  );
};