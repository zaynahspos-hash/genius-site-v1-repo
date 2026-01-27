import React, { useEffect, useState } from 'react';
import { customerService } from '../../services/customerService';
import { Product } from '../../types';
import { Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    customerService.getProfile().then(user => {
        setWishlist(user.wishlist || []);
        setLoading(false);
    });
  }, []);

  const removeFromWishlist = async (id: string) => {
      try {
        await customerService.toggleWishlist(id);
        setWishlist(prev => prev.filter(p => p._id !== id && p.id !== id));
      } catch (err) {
          console.error(err);
      }
  };

  if (loading) return <div>Loading wishlist...</div>;

  return (
    <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">My Wishlist</h2>
        
        {wishlist.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-100 text-center flex flex-col items-center">
                 <Heart size={48} className="text-gray-300 mb-4" />
                 <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                 <p className="text-gray-500 mt-2">Save items you love to view them later.</p>
                 <button onClick={() => navigate('/shop')} className="mt-4 text-indigo-600 font-medium">Start Shopping</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wishlist.map((product: any) => (
                    <div key={product._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
                        <div className="aspect-[4/5] bg-gray-100 relative">
                             <img src={product.images?.[0] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
                             <button 
                                onClick={() => removeFromWishlist(product._id || product.id)}
                                className="absolute top-3 right-3 bg-white p-2 rounded-full text-red-500 shadow-sm hover:bg-red-50"
                             >
                                 <Heart size={16} fill="currentColor" />
                             </button>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                            <p className="text-gray-500 text-sm mt-1">${product.price?.toFixed(2) || product.basePrice?.toFixed(2)}</p>
                            <button 
                                onClick={() => navigate(`/product/${product._id || product.id}`)}
                                className="w-full mt-3 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                            >
                                View Product
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};