
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { ProductEditor } from './ProductEditor';
import { productService } from '../../services/productService';
import { 
    Plus, Trash2, Edit2, Search, ChevronLeft, ChevronRight, ImageIcon, 
    MoreHorizontal, Filter, Copy, CheckSquare, Square, Archive, RefreshCw, AlertCircle
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering & Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('createdAt-desc');

  // Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1); 
    }, 500);
    return () => clearTimeout(handler);
  }, [keyword]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({ 
          page, 
          search: debouncedKeyword, 
          status: statusFilter,
          sort
      });
      setProducts(data.products);
      setPage(data.page);
      setTotalPages(data.pages);
      setTotalCount(data.count);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, debouncedKeyword, statusFilter, sort]);

  // --- Handlers ---

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.checked) {
          setSelectedIds(products.map(p => p.id));
      } else {
          setSelectedIds([]);
      }
  };

  const handleSelectOne = (id: string) => {
      if(selectedIds.includes(id)) {
          setSelectedIds(prev => prev.filter(i => i !== id));
      } else {
          setSelectedIds(prev => [...prev, id]);
      }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await productService.deleteProduct(id);
      loadProducts();
    }
  };

  const handleDuplicate = async (id: string) => {
      await productService.duplicateProduct(id);
      loadProducts();
  };

  const handleBulkDelete = async () => {
      if(confirm(`Delete ${selectedIds.length} products?`)) {
          await productService.bulkDelete(selectedIds);
          setSelectedIds([]);
          loadProducts();
      }
  };

  const handleBulkStatus = async (status: string) => {
      await productService.bulkStatus(selectedIds, status);
      setSelectedIds([]);
      loadProducts();
  };

  const handleSave = () => {
    loadProducts();
    setIsEditing(false);
    setEditingProduct(null);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'active': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
          case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
          default: return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your catalog ({totalCount} items)</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap hidden sm:block">
                Export
            </button>
            <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap hidden sm:block">
                Import
            </button>
            <button 
            onClick={() => { setEditingProduct(null); setIsEditing(true); }}
            className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
            >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
            </button>
        </div>
      </div>

      {/* Filters Bar - Responsive Scrolling */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6 flex flex-col xl:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
             {['all', 'active', 'draft', 'archived'].map(status => (
                 <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setPage(1); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors flex-shrink-0
                        ${statusFilter === status 
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800' 
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                 >
                     {status}
                 </button>
             ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400"/>
                <input 
                    type="text"
                    placeholder="Search products..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>
            <select 
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto cursor-pointer"
            >
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
                <option value="title-asc">A-Z</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="stock-asc">Stock: Low to High</option>
            </select>
          </div>
      </div>

      {/* Bulk Actions Header */}
      {selectedIds.length > 0 && (
          <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 p-3 rounded-xl mb-4 flex flex-wrap items-center justify-between animate-in slide-in-from-top-2 gap-2 sticky top-20 z-10 shadow-sm">
              <span className="text-sm font-medium text-indigo-900 dark:text-indigo-200 ml-2">{selectedIds.length} selected</span>
              <div className="flex gap-2">
                  <button onClick={() => handleBulkStatus('active')} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600">
                      Active
                  </button>
                  <button onClick={() => handleBulkStatus('draft')} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600">
                      Draft
                  </button>
                  <button onClick={handleBulkDelete} className="bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800">
                      Delete
                  </button>
              </div>
          </div>
      )}

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 flex items-center gap-2"><AlertCircle size={18}/> {error}</div>}

      {/* --- CONTENT AREA --- */}
      {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">Loading catalog...</div>
      ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">No products found matching your filters.</div>
      ) : (
        <>
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={selectedIds.length === products.length && products.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Inventory</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {products.map((product) => (
                                <tr key={product.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedIds.includes(product.id) ? 'bg-indigo-50/30 dark:bg-indigo-900/20' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={selectedIds.includes(product.id)}
                                            onChange={() => handleSelectOne(product.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden shrink-0">
                                                {product.images && product.images.length > 0 ? (
                                                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={20} className="text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <button 
                                                    onClick={() => { setEditingProduct(product); setIsEditing(true); }}
                                                    className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-left truncate max-w-[200px] block"
                                                >
                                                    {product.title}
                                                </button>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {product.variants?.length > 0 ? `${product.variants.length} variants` : `SKU: ${product.sku || '-'}`}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                                            {product.stock} in stock
                                        </div>
                                        {product.stock <= 10 && (
                                            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">Low Stock</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                                        {typeof product.category === 'object' ? (product.category as any)?.name : 'Uncategorized'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button 
                                                onClick={() => { setEditingProduct(product); setIsEditing(true); }}
                                                className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDuplicate(product.id)}
                                                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title="Duplicate"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden space-y-4">
                {products.map(product => (
                    <div key={product.id} className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${selectedIds.includes(product.id) ? 'ring-2 ring-indigo-500' : ''}`}>
                        <div className="flex gap-4">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600">
                                    {product.images && product.images.length > 0 ? (
                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full"><ImageIcon size={24} className="text-gray-400" /></div>
                                    )}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="absolute -top-2 -left-2 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 shadow-sm"
                                    checked={selectedIds.includes(product.id)}
                                    onChange={() => handleSelectOne(product.id)}
                                />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2">{product.title}</h3>
                                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(product.status)}`}>
                                        {product.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
                                    {typeof product.category === 'object' ? (product.category as any)?.name : 'Uncategorized'} • {product.variants?.length > 0 ? `${product.variants.length} Variants` : product.sku}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">${product.price}</span>
                                    <div className={`text-xs font-medium ${product.stock <= 10 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {product.stock} in stock
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                            <button 
                                onClick={() => { setEditingProduct(product); setIsEditing(true); }}
                                className="flex-1 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDuplicate(product.id)}
                                className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg hover:text-gray-900 dark:hover:text-white"
                            >
                                <Copy size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(product.id)}
                                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
      )}
            
      {/* Pagination */}
      {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <span className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                  <button 
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-gray-300"
                  >
                      <ChevronLeft size={16} />
                  </button>
                  <button 
                      disabled={page === totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-gray-300"
                  >
                      <ChevronRight size={16} />
                  </button>
              </div>
          </div>
      )}

      {isEditing && (
        <ProductEditor 
          onSave={handleSave} 
          onCancel={() => setIsEditing(false)} 
          initialData={editingProduct} 
        />
      )}
    </div>
  );
};
