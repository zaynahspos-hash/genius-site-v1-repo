import React, { useEffect, useState } from 'react';
import { Product } from '../../../types';
import { recommendationService } from '../../../services/recommendationService';
import { ProductCard } from '../ProductCard';
import { useStore } from '../../../App';

export const RecentlyViewed: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useStore();

  useEffect(() => {
    recommendationService.getRecentlyViewed().then(setProducts);
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="py-12 border-t border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recently Viewed</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {products.map(product => (
                <div key={product.id} className="scale-90 origin-top-left">
                    <ProductCard product={product} addToCart={addToCart} />
                </div>
            ))}
        </div>
    </div>
  );
};