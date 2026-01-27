import React, { useEffect, useState } from 'react';
import { Product } from '../../../types';
import { recommendationService } from '../../../services/recommendationService';
import { useStore } from '../../../App';
import { Plus, Check } from 'lucide-react';

export const FrequentlyBought: React.FC<{ mainProduct: Product }> = ({ mainProduct }) => {
  const [others, setOthers] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const { addToCart } = useStore();

  useEffect(() => {
    recommendationService.getFrequentlyBought(mainProduct.id || (mainProduct as any)._id)
        .then(data => {
            setOthers(data);
            setSelected(data.map((p: any) => p._id || p.id)); // Select all by default
        });
  }, [mainProduct]);

  if (others.length === 0) return null;

  // Calculate Total
  const allProducts = [mainProduct, ...others.filter(p => selected.includes(p.id || (p as any)._id))];
  const totalPrice = allProducts.reduce((acc, p) => acc + p.price, 0);

  const handleToggle = (id: string) => {
      if (selected.includes(id)) {
          setSelected(prev => prev.filter(i => i !== id));
      } else {
          setSelected(prev => [...prev, id]);
      }
  };

  const addAll = () => {
      allProducts.forEach(p => addToCart(p));
      alert('Bundle added to cart!');
  };

  return (
    <div className="py-8 border-t border-gray-100 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Bought Together</h3>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Visuals */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <img src={mainProduct.images[0]} className="w-full h-full object-cover" />
                </div>
                {others.map((p: any) => (
                    <React.Fragment key={p._id || p.id}>
                        <Plus className="text-gray-400 shrink-0" size={16} />
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200 relative">
                            <img src={p.images[0]} className="w-full h-full object-cover" />
                            {!selected.includes(p._id || p.id) && <div className="absolute inset-0 bg-white/60" />}
                        </div>
                    </React.Fragment>
                ))}
            </div>

            {/* List & Actions */}
            <div className="flex-1 space-y-3">
                <div className="flex items-start gap-2">
                    <div className="mt-1 bg-black text-white rounded-full p-0.5"><Check size={10} /></div>
                    <span className="text-sm font-medium text-gray-900">This item: {mainProduct.title}</span>
                    <span className="text-sm font-bold text-gray-900 ml-auto">${mainProduct.price.toFixed(2)}</span>
                </div>
                {others.map((p: any) => (
                    <div key={p._id || p.id} className="flex items-start gap-2 cursor-pointer" onClick={() => handleToggle(p._id || p.id)}>
                        <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center ${selected.includes(p._id || p.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white'}`}>
                            {selected.includes(p._id || p.id) && <Check size={10} />}
                        </div>
                        <span className="text-sm text-gray-600 hover:text-gray-900">{p.title}</span>
                        <span className="text-sm font-bold text-indigo-600 ml-auto">${p.price.toFixed(2)}</span>
                    </div>
                ))}
                
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-4">
                    <div className="text-lg font-bold text-gray-900">Total: ${totalPrice.toFixed(2)}</div>
                    <button onClick={addAll} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700">
                        Add All {allProducts.length} to Cart
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};