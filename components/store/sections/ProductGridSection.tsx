import React, { useEffect, useState } from 'react';
import { Product } from '../../../types';
import { productService } from '../../../services/productService';
import { ProductCard } from '../ProductCard';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../../../services/recommendationService';
import { useSettings } from '../../../contexts/SettingsContext';

interface ProductGridProps {
  settings: {
    title: string;
    subtitle?: string;
    source: 'featured' | 'bestseller' | 'newest' | 'manual';
    limit?: number;
    columns?: number;
    viewAllLink?: string;
    products?: string[]; // IDs for manual
  };
  addToCart: (p: Product) => void;
}

export const ProductGridSection: React.FC<ProductGridProps> = ({ settings, addToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { settings: globalSettings } = useSettings();

  const cols = settings.columns || globalSettings?.theme?.layout?.productsPerRow || 4;
  const gridClass = `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols} gap-4 md:gap-8`;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: any[] = [];
        const limit = settings.limit || 8;

        if (settings.source === 'manual' && settings.products) {
            const all = await productService.getProducts({ limit: 100 });
            data = all.products.filter((p: any) => settings.products?.includes(p.id || p._id));
        } else if (settings.source === 'bestseller') {
            data = await recommendationService.getTrending();
        } else if (settings.source === 'newest') {
            const res = await productService.getProducts({ sort: 'createdAt-desc', limit });
            data = res.products;
        } else {
            // Featured (default)
            const res = await productService.getProducts({ limit });
            data = res.products;
        }

        // Map backend imageUrl to frontend images array if needed
        const mappedData = data.map(p => ({
            ...p,
            id: p.id || p._id,
            images: p.images || (p.imageUrl ? [p.imageUrl] : ['https://via.placeholder.com/400'])
        }));

        setProducts(mappedData.slice(0, limit));
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [settings.source, settings.limit, settings.products]);

  if (loading) return (
    <div className="py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-gray-300" size={32}/>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Fetching Products</p>
    </div>
  );

  if (error) return (
    <div className="py-20 text-center flex flex-col items-center justify-center px-4">
        <AlertCircle className="text-red-400 mb-2" size={24} />
        <p className="text-gray-500 text-sm font-medium">Unable to display products at this time.</p>
    </div>
  );

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{settings.title}</h2>
                    {settings.subtitle && <p className="text-gray-500 mt-2 font-medium">{settings.subtitle}</p>}
                </div>
                {settings.viewAllLink && (
                    <button 
                        onClick={() => navigate(settings.viewAllLink!)}
                        className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-2 transition-colors group"
                    >
                        View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>

            <div className={gridClass}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart} />
                ))}
            </div>
        </div>
    </section>
  );
};
