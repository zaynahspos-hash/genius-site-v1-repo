
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import { productService } from '../../services/productService';
import { db } from '../../services/dbService';
import { ProductCard } from './ProductCard';
import { Filter, Search, X, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

interface ShopProps {
  addToCart: (p: Product) => void;
}

export const Shop: React.FC<ShopProps> = ({ addToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useSettings();
  
  // Settings driven grid
  const cols = settings?.theme?.layout?.productsPerRow || 4;
  const gridClass = `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols} gap-6 md:gap-8`;

  const initialCategory = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await productService.getProducts({ page: 1, limit: 50 }); // Fetch more for client side filtering demo
            // In real app, filtering happens on backend
            setProducts(data.products);
            setCategories(db.getCategories());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory) {
        result = result.filter(p => p.categoryId === selectedCategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (search) {
        result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    }

    if (sort === 'price-low') {
        result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        result.sort((a, b) => b.price - a.price);
    } else {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, priceRange, search, sort]);

  useEffect(() => {
      if(initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  return (
    <div className="bg-white min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-gray-100 pb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shop All</h1>
                <p className="text-gray-500 mt-2">{filteredProducts.length} Products Available</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium bg-white shadow-sm flex-1 justify-center"
                >
                    <SlidersHorizontal size={16} /> Filters
                </button>
                
                <div className="relative flex-1 md:w-64 hidden md:block">
                    <input 
                        type="text" 
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                </div>

                <select 
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
                >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
            {/* Sidebar Filters */}
            <div className={`
                md:w-64 flex-shrink-0 space-y-8 
                ${mobileFiltersOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden md:block'}
            `}>
                {mobileFiltersOpen && (
                    <div className="flex justify-between items-center mb-6 md:hidden">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                    </div>
                )}

                {/* Mobile Search */}
                <div className="relative md:hidden mb-6">
                    <input 
                        type="text" 
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
                    <div className="space-y-2">
                        <label className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedCategory === '' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'}`}>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="radio" 
                                    name="category" 
                                    className="hidden"
                                    checked={selectedCategory === ''}
                                    onChange={() => setSelectedCategory('')}
                                />
                                <span className="font-medium">All Products</span>
                            </div>
                        </label>
                        {categories.map(cat => (
                            <label key={cat.id} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedCategory === cat.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'}`}>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="category" 
                                        className="hidden"
                                        checked={selectedCategory === cat.id}
                                        onChange={() => setSelectedCategory(cat.id)}
                                    />
                                    <span className="font-medium">{cat.name}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-2.5 text-gray-500 text-xs">$</span>
                                <input 
                                    type="number"
                                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm"
                                    placeholder="Min"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                />
                            </div>
                            <span className="text-gray-300">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-2.5 text-gray-500 text-xs">$</span>
                                <input 
                                    type="number"
                                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm"
                                    placeholder="Max"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                />
                            </div>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1000" 
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>
                </div>
                
                {mobileFiltersOpen && (
                    <button 
                        onClick={() => setMobileFiltersOpen(false)}
                        className="w-full bg-black text-white py-3 rounded-xl font-bold mt-8"
                    >
                        Show {filteredProducts.length} Results
                    </button>
                )}
            </div>

            {/* Product Grid */}
            <div className="flex-1">
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading catalog...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                        <p className="text-gray-500 mt-2 mb-6">Try adjusting your filters or search.</p>
                        <button 
                            onClick={() => {setSelectedCategory(''); setSearch(''); setPriceRange([0, 1000]);}}
                            className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className={gridClass}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} addToCart={addToCart} />
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
