import React, { useEffect, useState } from 'react';
import { Product } from '../../../types';
import { recommendationService } from '../../../services/recommendationService';
import { ProductCard } from '../ProductCard';
import { useStore } from '../../../App';

export const RelatedProducts: React.FC<{ productId: string }> = ({ productId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useStore();

  useEffect(() => {
    recommendationService.getRelated(productId).then(setProducts);
  }, [productId]);

  if (products.length === 0) return null;

  return (
    <div className="py-12 border-t border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
        </div>
    </div>
  );
};