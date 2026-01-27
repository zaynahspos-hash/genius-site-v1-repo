
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, ProductVariant } from '../../types';
import { productService } from '../../services/productService';
import { customerService } from '../../services/customerService';
import { recommendationService } from '../../services/recommendationService';
import { ShoppingBag, Star, Truck, ShieldCheck, ChevronRight, Minus, Plus, Heart, RotateCcw, FileText, MessageSquare, Box } from 'lucide-react';
import { ReviewSection } from './reviews/ReviewSection';
import { RelatedProducts } from './product/RelatedProducts';
import { FrequentlyBought } from './product/FrequentlyBought';
import { RecentlyViewed } from './product/RecentlyViewed';
import { SEO } from '../common/SEO';

interface ProductDetailsProps {
  addToCart: (p: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'shipping'>('info');

  useEffect(() => {
    if (id) {
        setLoading(true);
        productService.getProduct(id).then(p => {
            setProduct(p);
            setSelectedImage(p.images[0] || '');
            if(p.variants?.length > 0) setSelectedVariant(p.variants[0]);
            setLoading(false);
            
            // Track View
            recommendationService.trackView(p.id || (p as any)._id);

        }).catch(err => {
            console.error(err);
            navigate('/shop');
        });
        
        // Check wishlist
        customerService.getProfile().then(user => {
            if (user && user.wishlist) {
                const inList = user.wishlist.some((w: any) => w._id === id || w.id === id || w === id);
                setIsWishlisted(inList);
            }
        }).catch(() => {});
    }
  }, [id, navigate]);

  const handleWishlist = async () => {
      if(!id) return;
      try {
          await customerService.toggleWishlist(id);
          setIsWishlisted(!isWishlisted);
      } catch (e) { alert('Please login to use wishlist'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return null;

  const handleAddToCart = () => {
    const itemToAdd = {
        ...product,
        price: selectedVariant ? selectedVariant.price : product.price,
        selectedVariant: selectedVariant || undefined
    };
    for(let i=0; i<quantity; i++) {
        addToCart(itemToAdd);
    }
  };

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.inventory;

  // Schema.org Data
  const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.title,
      "image": product.images,
      "description": product.description.replace(/<[^>]*>?/gm, ''), // Strip HTML
      "sku": product.sku,
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "USD", // Should be dynamic from settings
        "price": currentPrice,
        "availability": currentStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
  };

  return (
    <div className="min-h-screen bg-white pt-10 pb-20 animate-in fade-in duration-500">
      <SEO 
        title={product.seo?.title || product.title}
        description={product.seo?.description || product.description.substring(0, 160)}
        image={product.images[0]}
        type="product"
        schema={productSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={14} className="mx-2 shrink-0" />
            <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/shop')}>Shop</span>
            <ChevronRight size={14} className="mx-2 shrink-0" />
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
            {/* Gallery */}
            <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group border border-gray-100">
                    <img 
                        src={selectedImage || 'https://via.placeholder.com/600'} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button 
                        onClick={handleWishlist}
                        className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-colors ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'}`}
                    >
                        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedImage(img)}
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === img ? 'border-indigo-600' : 'border-transparent hover:border-gray-200'}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Summary Actions */}
            <div className="flex flex-col">
                <div className="mb-2">
                    <span className="text-sm font-bold text-indigo-600 tracking-wide uppercase">{product.categoryName}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.title}</h1>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
                    <button 
                        onClick={() => setActiveTab('reviews')}
                        className="flex items-center gap-1 text-yellow-400 hover:text-yellow-500 cursor-pointer"
                    >
                        {[1,2,3,4,5].map(s => <Star key={s} size={18} fill={s <= (product as any).rating ? "currentColor" : "none"} className={s <= (product as any).rating ? "" : "text-gray-300"} />)}
                        <span className="text-sm text-gray-500 ml-2">({(product as any).reviewCount || 0} reviews)</span>
                    </button>
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-900 mb-3">Select Option</label>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map((v, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedVariant(v)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                        selectedVariant?.sku === v.sku 
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                                >
                                    {v.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex items-center border border-gray-200 rounded-lg sm:w-auto w-full">
                        <button 
                            className="p-3 text-gray-500 hover:text-gray-900"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            <Minus size={18} />
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button 
                            className="p-3 text-gray-500 hover:text-gray-900"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        disabled={currentStock === 0}
                        className="flex-1 bg-black text-white py-3 sm:py-0 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform active:scale-[0.98]"
                    >
                        <ShoppingBag size={20} />
                        {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <Truck size={24} className="text-gray-600" />
                        <div>
                            <h4 className="font-bold text-sm text-gray-900">Free Delivery</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Orders over $100</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <ShieldCheck size={24} className="text-gray-600" />
                        <div>
                            <h4 className="font-bold text-sm text-gray-900">Return Policy</h4>
                            <p className="text-xs text-gray-500 mt-0.5">30 Day Returns</p>
                        </div>
                    </div>
                </div>

                {/* Frequently Bought Together */}
                <FrequentlyBought mainProduct={product} />
            </div>
        </div>

        {/* TABS SECTION */}
        <div className="mb-20">
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setActiveTab('info')}
                    className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                        activeTab === 'info' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Product Info
                </button>
                <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                        activeTab === 'reviews' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Reviews ({(product as any).reviewCount || 0})
                </button>
                <button 
                    onClick={() => setActiveTab('shipping')}
                    className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                        activeTab === 'shipping' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Shipping & Returns
                </button>
            </div>

            <div className="min-h-[300px]">
                {activeTab === 'info' && (
                    <div className="prose prose-lg max-w-none text-gray-600 animate-in fade-in duration-300">
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="animate-in fade-in duration-300">
                        <ReviewSection productId={id || ''} />
                    </div>
                )}

                {activeTab === 'shipping' && (
                    <div className="animate-in fade-in duration-300 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-8 rounded-2xl">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <Truck className="text-indigo-600" /> Shipping Information
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0"/> Free standard shipping on all orders over $100.</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0"/> Orders are processed within 1-2 business days.</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0"/> International shipping available to select countries.</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0"/> Tracking information sent immediately after dispatch.</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-2xl">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <RotateCcw className="text-indigo-600" /> Returns & Exchanges
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0"/> 30-day money-back guarantee for unworn items.</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0"/> Easy online return process via your account dashboard.</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0"/> Return shipping is free for exchanges.</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0"/> Refunds processed within 5 business days of receipt.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        <RelatedProducts productId={id || ''} />
        <RecentlyViewed />
      </div>
    </div>
  );
};
