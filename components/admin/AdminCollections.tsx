import React, { useEffect, useState } from 'react';
import { collectionService } from '../../services/collectionService';
import { Plus, Edit2, Trash2, Image as ImageIcon, Layers, Save, X, ArrowLeft, RefreshCw } from 'lucide-react';
import { productService } from '../../services/productService';

export const AdminCollections: React.FC = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Editor State
  const [formData, setFormData] = useState<any>({
      name: '', description: '', type: 'manual', conditions: [], products: []
  });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
      try {
          const data = await collectionService.getAll();
          setCollections(data);
      } catch (err) { console.error(err); }
  };

  const handleEdit = async (id: string | null) => {
      if (id) {
          const data = await collectionService.getById(id);
          setFormData(data);
          setEditingId(id);
      } else {
          setFormData({ name: '', description: '', type: 'manual', conditions: [], products: [] });
          setEditingId(null);
      }
      setView('edit');
  };

  const handleSave = async () => {
      try {
          await collectionService.save({ ...formData, id: editingId });
          setView('list');
          loadCollections();
      } catch (err) { alert('Save failed'); }
  };

  const handleDelete = async (id: string) => {
      if(confirm('Delete this collection?')) {
          await collectionService.delete(id);
          loadCollections();
      }
  };

  const addCondition = () => {
      setFormData({
          ...formData,
          conditions: [...(formData.conditions || []), { field: 'price', operator: 'greater_than', value: '' }]
      });
  };

  const updateCondition = (index: number, field: string, value: string) => {
      const newConds = [...formData.conditions];
      newConds[index] = { ...newConds[index], [field]: value };
      setFormData({ ...formData, conditions: newConds });
  };

  const removeCondition = (index: number) => {
      const newConds = formData.conditions.filter((_: any, i: number) => i !== index);
      setFormData({ ...formData, conditions: newConds });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = await productService.uploadImage(file);
          setFormData({ ...formData, image: url });
      }
  };

  if (view === 'edit') {
      return (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
                      <ArrowLeft size={20} /> Back
                  </button>
                  <h1 className="text-xl font-bold">{editingId ? 'Edit Collection' : 'New Collection'}</h1>
                  <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                      <Save size={18} /> Save
                  </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                  <div className="col-span-2 space-y-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                          <label className="block text-sm font-medium">Title</label>
                          <input type="text" className="w-full border rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                          
                          <label className="block text-sm font-medium">Description</label>
                          <textarea className="w-full border rounded-lg px-3 py-2" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                          <h3 className="font-bold text-gray-900">Collection Type</h3>
                          <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name="type" checked={formData.type === 'manual'} onChange={() => setFormData({...formData, type: 'manual'})} />
                                  Manual
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name="type" checked={formData.type === 'automated'} onChange={() => setFormData({...formData, type: 'automated'})} />
                                  Automated
                              </label>
                          </div>

                          {formData.type === 'automated' && (
                              <div className="border-t pt-4 mt-4 space-y-4">
                                  <h4 className="text-sm font-medium text-gray-700">Conditions</h4>
                                  {formData.conditions?.map((cond: any, idx: number) => (
                                      <div key={idx} className="flex gap-2">
                                          <select className="border rounded px-2 py-1 text-sm" value={cond.field} onChange={e => updateCondition(idx, 'field', e.target.value)}>
                                              <option value="title">Product Title</option>
                                              <option value="price">Price</option>
                                              <option value="stock">Stock</option>
                                          </select>
                                          <select className="border rounded px-2 py-1 text-sm" value={cond.operator} onChange={e => updateCondition(idx, 'operator', e.target.value)}>
                                              <option value="equals">Equals</option>
                                              <option value="not_equals">Not Equals</option>
                                              <option value="greater_than">Greater Than</option>
                                              <option value="less_than">Less Than</option>
                                              <option value="contains">Contains</option>
                                          </select>
                                          <input type="text" className="border rounded px-2 py-1 text-sm flex-1" value={cond.value} onChange={e => updateCondition(idx, 'value', e.target.value)} />
                                          <button onClick={() => removeCondition(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                      </div>
                                  ))}
                                  <button onClick={addCondition} className="text-indigo-600 text-sm font-medium hover:underline">+ Add Condition</button>
                              </div>
                          )}
                          
                          {formData.type === 'manual' && (
                              <div className="border-t pt-4 mt-4 text-center text-gray-500 py-8 border-dashed border-2 rounded-lg">
                                  Manual product picker would go here.
                              </div>
                          )}
                      </div>
                  </div>

                  <div className="col-span-1 space-y-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                          <label className="block text-sm font-medium mb-2">Collection Image</label>
                          <div className="aspect-square bg-gray-50 rounded border flex flex-col items-center justify-center overflow-hidden relative group">
                              {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={32} />}
                              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                  Upload
                                  <input type="file" className="hidden" onChange={handleImageUpload} />
                              </label>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Collections</h1>
        <button onClick={() => handleEdit(null)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
          <Plus size={18} /> Create Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(col => (
              <div key={col._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gray-100 relative">
                      {col.image ? <img src={col.image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon size={48}/></div>}
                      <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide text-gray-700">
                          {col.type}
                      </span>
                  </div>
                  <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">{col.name}</h3>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(col._id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Edit2 size={16}/></button>
                              <button onClick={() => handleDelete(col._id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={16}/></button>
                          </div>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{col.description || 'No description'}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Layers size={16} />
                          {col.productCount} products
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};