import React, { useEffect, useState } from 'react';
import { reviewService } from '../../services/reviewService';
import { Star, Check, X, MessageSquare, Trash2, Filter, User, AlertCircle } from 'lucide-react';

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
          // Safely extract reviews array from response object
          if (data && Array.isArray(data.reviews)) {
              setReviews(data.reviews);
          } else if (Array.isArray(data)) {
              setReviews(data);
          } else {
              setReviews([]); // Fallback to empty array to prevent map error
          }
      } catch(e: any) { 
          console.error(e);
          setError('Failed to load reviews. ' + (e.message || ''));
          setReviews([]); // Ensure it's an array even on error
      } 
      finally { setLoading(false); }
  };

  const handleStatus = async (id: string, newStatus: string) => {
      try {
          await reviewService.updateStatus(id, newStatus);
          fetchReviews();
      } catch(e) { alert('Failed to update status'); }
  };

  // Helper to safely format dates
  const formatDate = (dateString: string) => {
      try {
          if (!dateString) return 'N/A';
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
      } catch (e) {
          return 'N/A';
      }
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
            <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">Loading reviews...</div>
        ) : (
            <>
                {/* DESKTOP TABLE */}
                <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
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
                                            ${review.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                            review.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {review.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {review.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleStatus(review._id, 'approved')} className="p-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-900/40"><Check size={16}/></button>
                                                    <button onClick={() => handleStatus(review._id, 'rejected')} className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/40"><X size={16}/></button>
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

                {/* MOBILE CARD VIEW */}
                <div className="md:hidden space-y-4">
                    {reviews.map(review => (
                        <div key={review._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <User size={14} className="text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{review.user?.name || 'Anonymous'}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{formatDate(review.createdAt)}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold capitalize 
                                    ${review.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                    review.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {review.status}
                                </span>
                            </div>

                            <div className="mb-3">
                                <div className="flex text-amber-400 mb-1">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} className={s <= review.rating ? "" : "text-gray-300 dark:text-gray-600"} />)}
                                </div>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">{review.product?.title || 'Unknown Product'}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{review.comment}"</p>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                {review.status === 'pending' ? (
                                    <>
                                        <button onClick={() => handleStatus(review._id, 'approved')} className="flex-1 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium">Approve</button>
                                        <button onClick={() => handleStatus(review._id, 'rejected')} className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">Reject</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleStatus(review._id, 'pending')} className="w-full py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium">Reset to Pending</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {reviews.length === 0 && <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">No reviews found.</div>}
            </>
        )}
    </div>
  );
};