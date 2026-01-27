
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import { Sparkles, Save, ArrowLeft, Loader2, Link, ImageIcon, Wand2, MoreVertical, X } from 'lucide-react';
import { generateProductDescription, generateProductImage } from '../../services/geminiService';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { ImagePicker } from './common/ImagePicker';
import { RichTextEditor } from './common/RichTextEditor';

interface ProductEditorProps {
  onSave: () => void;
  onCancel: () => void;
  initialData?: Product | null;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({ onSave, onCancel, initialData }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data safely
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    slug: '',
    description: '',
    price: 0,
    comparePrice: 0,
    costPrice: 0,
    categoryId: '',
    images: [],
    tags: [],
    variants: [],
    status: 'draft',
    stock: 0,
    sku: '',
    hasVariants: false,
    seo: { title: '', description: '', keywords: [] },
    relatedProducts: [],
    upsellProducts: [],
    ...initialData
  });

  // Ensure arrays/objects exist if initialData was partial
  useEffect(() => {
      if (initialData) {
          setFormData(prev => ({
              ...prev,
              images: prev.images || [],
              tags: prev.tags || [],
              seo: prev.seo || { title: '', description: '', keywords: [] },
              relatedProducts: prev.relatedProducts || [],
              variants: prev.variants || []
          }));
      }
  }, [initialData]);

  const [tagInput, setTagInput] = useState(initialData?.tags?.join(', ') || '');

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => {});
    productService.getProducts({ limit: 100 }).then(data => setAllProducts(data.products)).catch(() => {});
  }, []);

  const handleGenerateDescription = async () => {
    if (!formData.title) return;
    setIsGenerating(true);
    const description = await generateProductDescription(formData.title, tagInput);
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const handleGenerateImage = async () => {
    if (!formData.title) return;
    setIsGeneratingImage(true);
    const imageUrl = await generateProductImage(formData.title);
    if (imageUrl) {
      setFormData(prev => ({ ...prev, images: [imageUrl, ...(prev.images || [])] }));
    } else {
      alert("Failed to generate image. Please check your API key and quota.");
    }
    setIsGeneratingImage(false);
  };

  const toggleSelection = (field: 'relatedProducts' | 'upsellProducts', id: string) => {
      const current = formData[field] || [];
      const currentIds = current.map((p: any) => typeof p === 'string' ? p : p._id || p.id);
      
      if (currentIds.includes(id)) {
          setFormData(prev => ({ ...prev, [field]: prev[field]?.filter((p: any) => (typeof p === 'string' ? p : p._id) !== id) }));
      } else {
          setFormData(prev => ({ ...prev, [field]: [...current, id] }));
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productPayload = {
        ...formData,
        tags: tagInput.split(',').map(t => t.trim()).filter(t => t),
        slug: formData.slug || (formData.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };

      if (initialData && (initialData.id || (initialData as any)._id)) {
        await productService.updateProduct(initialData.id || (initialData as any)._id, productPayload);
      } else {
        await productService.createProduct(productPayload);
      }
      onSave();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-[60] flex flex-col animate-in fade-in duration-200 font-sans">
        
        {/* Header - Fixed Height & Flex-shrink-0 ensures it doesn't overlap content */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between shadow-sm z-30 flex-shrink-0">
             <div className="flex items-center gap-3 overflow-hidden">
                 <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 shrink-0">
                     <ArrowLeft size={20} />
                 </button>
                 <div className="min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">
                        {initialData ? 'Edit Product' : 'New Product'}
                    </h1>
                    <div className="flex items-center gap-2 md:hidden mt-0.5">
                       <span className={`inline-block w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                       <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{formData.status}</span>
                    </div>
                 </div>
             </div>

             <div className="flex items-center gap-2 md:gap-3 shrink-0">
                 <div className="hidden md:flex items-center gap-2 mr-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{formData.status}</span>
                 </div>
                 <button 
                    onClick={onCancel} 
                    className="hidden md:block px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                 >
                     Discard
                 </button>
                 <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="px-4 md:px-6 py-2 bg-black dark:bg-indigo-600 text-white font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-indigo-700 shadow-sm flex items-center gap-2 disabled:opacity-50 text-sm md:text-base"
                 >
                     {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                     <span className="hidden md:inline">Save Product</span>
                     <span className="md:hidden">Save</span>
                 </button>
             </div>
        </div>

        {/* Content - Flex-1 ensures it takes remaining height and scrolls nicely */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-gray-50 dark:bg-gray-900">
            {error && (
                <div className="max-w-6xl mx-auto bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 border border-red-100 dark:border-red-900/50 flex items-center gap-2">
                    <X size={18} /> {error}
                </div>
            )}
            
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-20">
                
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Product Title</label>
                            <input 
                                required
                                type="text" 
                                value={formData.title || ''} 
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base font-medium placeholder-gray-400 dark:bg-gray-700 dark:text-white"
                                placeholder="e.g. Classic Leather Jacket"
                            />
                        </div>
                         <div className="space-y-1.5">
                             <div className="flex justify-between items-center">
                                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Description</label>
                                <button
                                    type="button"
                                    onClick={handleGenerateDescription}
                                    disabled={isGenerating || !formData.title}
                                    className="text-xs flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md transition-colors"
                                >
                                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                    AI Write
                                </button>
                             </div>
                            <RichTextEditor 
                                value={formData.description || ''} 
                                onChange={val => setFormData({...formData, description: val})}
                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" 
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ImageIcon size={20} className="text-gray-500 dark:text-gray-400" /> Media
                          </h2>
                          <button
                              type="button"
                              onClick={handleGenerateImage}
                              disabled={isGeneratingImage || !formData.title}
                              className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800 rounded-lg font-bold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors w-full sm:w-auto justify-center"
                          >
                              {isGeneratingImage ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                              AI Generate Image
                          </button>
                        </div>
                        <ImagePicker 
                            images={formData.images || []}
                            onChange={(imgs) => setFormData({...formData, images: imgs})}
                        />
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Inventory & Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU (Stock Keeping Unit)</label>
                                <input 
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
                                    value={formData.sku || ''} 
                                    onChange={e => setFormData({...formData, sku: e.target.value})} 
                                    placeholder="e.g. SKU-12345"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
                                    value={formData.stock || 0} 
                                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">Status</h3>
                        <select 
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as any})}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-white cursor-pointer"
                        >
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">Pricing</h3>
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                                    <input 
                                        type="number" 
                                        value={formData.price || 0} 
                                        onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                                        className="w-full pl-7 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:border-indigo-500 font-medium dark:bg-gray-700 dark:text-white" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Compare Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                                    <input 
                                        type="number" 
                                        value={formData.comparePrice || 0} 
                                        onChange={e => setFormData({...formData, comparePrice: Number(e.target.value)})} 
                                        className="w-full pl-7 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">Organization</h3>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                value={typeof formData.categoryId === 'string' ? formData.categoryId : (formData.categoryId as any)?._id || ''}
                                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none bg-white dark:bg-gray-700 text-sm cursor-pointer dark:text-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id || (cat as any)._id} value={cat.id || (cat as any)._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                            <input 
                                type="text" 
                                value={tagInput} 
                                onChange={e => setTagInput(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:border-indigo-500 text-sm dark:bg-gray-700 dark:text-white" 
                                placeholder="Summer, Sale, New" 
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">Comma separated</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
