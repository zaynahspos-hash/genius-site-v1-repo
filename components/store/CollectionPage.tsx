
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { storeService } from '../../services/storeService';
import { Filter, ChevronDown, X, SlidersHorizontal, Check } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export const CollectionPage: React.FC<{ addToCart: any }> = ({ addToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useSettings();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);

  // Filter State
  const sort = searchParams.get('sort') || 'featured';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  // Dynamic Grid
  const cols = settings?.theme?.layout?.productsPerRow || 4;
  const gridClass = `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols} gap-6 md:gap-8`;

  const updateParam = (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams);
      if(value) newParams.set(key, value);
      else newParams.delete(key);
      setSearchParams(newParams);
  };

  useEffect(() => {
    setLoading(true);
    storeService.getProducts({ sort, category, minPrice, maxPrice, limit: 12 })
      .then(data => {
          setProducts(data.products);
          setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-gray-100 pb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 capitalize tracking-tight">
                    {category ? category.replace('-', ' ') : 'Collection'}
                </h1>
                <p className="text-gray-500 mt-2">{total} products</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <button 
                    onClick={() => setShowFilters(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 md:hidden flex-1 justify-center bg-white"
                >
                    <SlidersHorizontal size={16} /> Filters
                </button>
                <select 
                    value={sort}
                    onChange={(e) => updateParam('sort', e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer w-full md:w-auto"
                >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className={`
                md:w-64 flex-shrink-0 bg-white md:bg-transparent
                ${showFilters ? 'fixed inset-0 z-50 p-6 overflow-y-auto animate-in slide-in-from-bottom-10' : 'hidden md:block'}
            `}>
                {showFilters && (
                    <div className="flex justify-between items-center mb-8 md:hidden">
                        <h2 className="text-xl font-bold">Filter & Sort</h2>
                        <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                    </div>
                )}

                <div className="space-y-8">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range</h3>
                        <div className="flex gap-2 items-center">
                            <input 
                                type="number" placeholder="Min" 
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                value={minPrice} onChange={e => updateParam('minPrice', e.target.value)}
                            />
                            <span className="text-gray-400">-</span>
                            <input 
                                type="number" placeholder="Max" 
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                value={maxPrice} onChange={e => updateParam('maxPrice', e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* Clear Filters */}
                    {(minPrice || maxPrice || category) && (
                        <button 
                            onClick={() => { setSearchParams({}); setShowFilters(false); }}
                            className="w-full text-sm text-red-600 hover:text-red-700 flex items-center justify-center gap-1 font-medium bg-red-50 px-3 py-2.5 rounded-lg transition-colors"
                        >
                            <X size={14} /> Clear All Filters
                        </button>
                    )}

                    {showFilters && (
                        <button 
                            onClick={() => setShowFilters(false)}
                            className="w-full bg-black text-white py-3 rounded-xl font-bold mt-auto md:hidden"
                        >
                            Show Results
                        </button>
                    )}
                </div>
            </div>

            {/* Backdrop for mobile */}
            {showFilters && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setShowFilters(false)} />}

            {/* Grid */}
            <div className="flex-1">
                {loading ? (
                    <div className={gridClass}>
                        {[1,2,3,4].map(i => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No products found in this collection.</p>
                        <button onClick={() => setSearchParams({})} className="mt-4 text-indigo-600 font-bold hover:underline">Clear filters</button>
                    </div>
                ) : (
                    <div className={gridClass}>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} addToCart={addToCart} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
