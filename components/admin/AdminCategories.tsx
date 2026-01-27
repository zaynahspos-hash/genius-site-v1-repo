import React, { useEffect, useState } from 'react';
import { Category } from '../../types';
import { categoryService } from '../../services/categoryService';
import { Plus, Edit2, Trash2, GripVertical, Image as ImageIcon, Check, X } from 'lucide-react';
import { productService } from '../../services/productService'; // reuse upload

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      if (editingCategory.id || (editingCategory as any)._id) {
        await categoryService.update((editingCategory.id || (editingCategory as any)._id), editingCategory);
      } else {
        await categoryService.create(editingCategory);
      }
      fetchCategories();
      setIsEditing(false);
      setEditingCategory(null);
    } catch (err) {
      alert('Error saving category');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category?')) {
      await categoryService.delete(id);
      fetchCategories();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = await productService.uploadImage(file);
          setEditingCategory(prev => ({ ...prev, image: url }));
      }
  };

  // Move category (simple array swap)
  const moveCategory = async (index: number, direction: 'up' | 'down') => {
      const newCats = [...categories];
      if (direction === 'up' && index > 0) {
          [newCats[index], newCats[index-1]] = [newCats[index-1], newCats[index]];
      } else if (direction === 'down' && index < newCats.length - 1) {
          [newCats[index], newCats[index+1]] = [newCats[index+1], newCats[index]];
      }
      setCategories(newCats);
      // Persist order
      await categoryService.reorder(newCats.map(c => c._id || c.id));
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button 
          onClick={() => { setEditingCategory({ name: '', description: '', parent: null }); setIsEditing(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <div className="col-span-1 text-center">Order</div>
                <div className="col-span-1">Image</div>
                <div className="col-span-4">Name</div>
                <div className="col-span-3">Parent</div>
                <div className="col-span-1 text-center">Products</div>
                <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
                {categories.map((cat, idx) => (
                    <div key={cat._id || cat.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 group">
                        <div className="col-span-1 flex flex-col items-center justify-center gap-1 text-gray-400">
                            <button onClick={() => moveCategory(idx, 'up')} className="hover:text-indigo-600 disabled:opacity-30" disabled={idx === 0}>▲</button>
                            <GripVertical size={14} />
                            <button onClick={() => moveCategory(idx, 'down')} className="hover:text-indigo-600 disabled:opacity-30" disabled={idx === categories.length - 1}>▼</button>
                        </div>
                        <div className="col-span-1">
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-gray-400" />}
                            </div>
                        </div>
                        <div className="col-span-4 font-medium text-gray-900 flex items-center">
                            {cat.parent && <span className="text-gray-400 mr-2">↳</span>}
                            {cat.name}
                        </div>
                        <div className="col-span-3 text-sm text-gray-500">
                            {cat.parent ? cat.parent.name : '-'}
                        </div>
                        <div className="col-span-1 text-center text-sm font-medium bg-gray-100 rounded-full py-0.5">
                            {cat.productCount || 0}
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                            <button onClick={() => { setEditingCategory(cat); setIsEditing(true); }} className="p-2 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50"><Edit2 size={16}/></button>
                            <button onClick={() => handleDelete(cat._id || cat.id)} className="p-2 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {isEditing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">{editingCategory?.id || (editingCategory as any)?._id ? 'Edit' : 'New'} Category</h2>
                      <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleSave} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input required type="text" className="w-full border rounded-lg px-3 py-2" 
                              value={editingCategory?.name} 
                              onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })} 
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                          <select className="w-full border rounded-lg px-3 py-2"
                              value={(editingCategory?.parent as any)?._id || editingCategory?.parent || ''}
                              onChange={e => setEditingCategory({ ...editingCategory, parent: e.target.value || null })}
                          >
                              <option value="">None (Top Level)</option>
                              {categories
                                .filter(c => c._id !== (editingCategory as any)?._id) // Prevent self-parenting
                                .map(c => <option key={c._id} value={c._id}>{c.name}</option>)
                              }
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea className="w-full border rounded-lg px-3 py-2" rows={3}
                              value={editingCategory?.description} 
                              onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })} 
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                          <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gray-100 rounded border overflow-hidden">
                                  {editingCategory?.image && <img src={editingCategory.image} className="w-full h-full object-cover" />}
                              </div>
                              <input type="file" onChange={handleImageUpload} />
                          </div>
                      </div>
                      <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">Save Category</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};