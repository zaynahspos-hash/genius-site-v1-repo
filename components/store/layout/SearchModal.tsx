import React, { useState, useEffect } from 'react';
import { Search, X, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storeService } from '../../../services/storeService';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                setLoading(true);
                try {
                    const data = await storeService.getProducts({ search: query, limit: 5 });
                    setResults(data.products);
                } catch (e) { console.error(e); } 
                finally { setLoading(false); }
            } else {
                setResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white animate-in fade-in duration-200">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                    <Search size={24} className="text-gray-400" />
                    <input 
                        autoFocus
                        className="flex-1 text-2xl font-medium placeholder-gray-300 outline-none"
                        placeholder="Search products..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <div className="py-8">
                    {loading ? (
                        <div className="flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>
                    ) : query && results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.map(product => (
                                <div 
                                    key={product._id || product.id}
                                    onClick={() => { onClose(); navigate(`/products/${product.slug}`); }}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl cursor-pointer group"
                                >
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        <img src={product.images[0]} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{product.title}</h4>
                                        <p className="text-sm text-gray-500">${product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : query.length > 2 ? (
                        <div className="text-center text-gray-500">No results found for "{query}"</div>
                    ) : (
                        <div className="text-sm text-gray-500">
                            <p className="mb-2 font-medium text-gray-900">Popular Searches</p>
                            <div className="flex gap-2">
                                {['Summer', 'Watches', 'New Arrivals'].map(term => (
                                    <button 
                                        key={term}
                                        onClick={() => setQuery(term)}
                                        className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {results.length > 0 && (
                    <div className="text-center pt-4 border-t border-gray-100">
                        <button 
                            onClick={() => { onClose(); navigate(`/shop?search=${query}`); }}
                            className="text-indigo-600 font-medium hover:underline flex items-center justify-center gap-1"
                        >
                            View all results <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};