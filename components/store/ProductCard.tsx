
import React, { useState } from 'react';
import { Product } from '../../types';
import { ShoppingBag, Star, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { useSettings } from '../../contexts/SettingsContext';

interface ProductCardProps {
  product: Product;
  addToCart: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [isHovered, setIsHovered] = useState(false);

  const style = settings?.theme?.layout?.productCardStyle || 'minimal'; // minimal, full, overlay, list

  const toggleWishlist = async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
          await customerService.toggleWishlist(product.id || (product as any)._id);
      } catch (e) {}
  };

  const discount = product.comparePrice && product.comparePrice > product.price 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;

  // --- STYLE: LIST VIEW ---
  if (style === 'list') {
      return (
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all p-4 cursor-pointer w-full" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                <img src={product.images[0]} className="w-full h-full object-cover" />
                {discount > 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">-{discount}%</span>}
            </div>
            <div className="flex-1 w-full">
                <div className="text-xs text-gray-500 mb-1">{product.categoryName}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                    {product.comparePrice && <span className="text-sm text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>}
                </div>
                <div className="flex gap-2">
                    <button onClick={(e) => {e.stopPropagation(); addToCart(product);}} className="flex-1 sm:flex-none bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">Add to Cart</button>
                    <button onClick={toggleWishlist} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"><Heart size={20} className="text-gray-600"/></button>
                </div>
            </div>
        </div>
      );
  }

  // --- STYLE: OVERLAY ---
  if (style === 'overlay') {
      return (
        <div 
            className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer w-full"
            onClick={() => navigate(`/product/${product.id}`)}
        >
            <img src={product.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={toggleWishlist} className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm"><Heart size={18}/></button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <h3 className="font-bold text-lg mb-1 leading-tight">{product.title}</h3>
                <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-lg">${product.price.toFixed(2)}</span>
                    <button onClick={(e) => {e.stopPropagation(); addToCart(product);}} className="bg-white text-black p-2.5 rounded-full hover:scale-110 transition-transform"><ShoppingBag size={18}/></button>
                </div>
            </div>
        </div>
      );
  }

  // --- STYLE: FULL & MINIMAL (Default) ---
  return (
    <div 
      className="group relative flex flex-col h-full cursor-pointer w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 relative mb-4">
        <img
          src={product.images[0] || 'https://via.placeholder.com/400'}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-in-out ${isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'}`}
        />
        {product.images[1] && (
            <img
                src={product.images[1]}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm shadow-sm">-{discount}%</span>}
            {product.isFeatured && <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm shadow-sm">New</span>}
        </div>

        <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 ${style === 'full' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
            <button 
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                disabled={product.inventory === 0}
                className="flex-1 bg-white text-black h-10 rounded shadow-lg font-bold text-sm hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-75 disabled:hover:bg-white disabled:hover:text-black"
            >
                {product.inventory === 0 ? 'Sold Out' : <><ShoppingBag size={16} /> Add</>}
            </button>
            <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="w-10 h-10 bg-white text-black rounded shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"><Eye size={18} /></button>
        </div>

        <button onClick={toggleWishlist} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-all shadow-sm opacity-0 group-hover:opacity-100"><Heart size={16} /></button>
      </div>

      <div className="flex flex-col flex-1">
        <p className="text-xs text-gray-500 mb-1">{product.categoryName}</p>
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">{product.title}</h3>
        
        <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</p>
                {product.comparePrice && <p className="text-xs text-gray-400 line-through">${product.comparePrice.toFixed(2)}</p>}
            </div>
            {/* Show Rating only in Full mode */}
            {style === 'full' && (product as any).rating > 0 && (
                <div className="flex items-center gap-1">
                    <Star size={12} fill="currentColor" className="text-yellow-400" />
                    <span className="text-xs text-gray-500">{(product as any).rating}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
