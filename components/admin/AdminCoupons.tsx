
import React, { useEffect, useState } from 'react';
import { couponService } from '../../services/couponService';
import { Plus, Edit2, Trash2, Tag, Check, X } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await couponService.getAll();
      setCoupons(data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await couponService.update(formData._id, formData);
      } else {
        await couponService.create(formData);
      }
      setIsEditing(false);
      loadCoupons();
    } catch (err) { alert('Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this coupon?')) {
      await couponService.delete(id);
      loadCoupons();
    }
  };

  const openEdit = (coupon: any = {}) => {
    setFormData({ 
        discountType: 'percentage', 
        isActive: true, 
        ...coupon 
    });
    setIsEditing(true);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Coupons</h1>
        <button onClick={() => openEdit()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 w-full sm:w-auto justify-center transition-colors shadow-sm">
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                    <tr>
                        <th className="px-6 py-4">Code</th>
                        <th className="px-6 py-4">Discount</th>
                        <th className="px-6 py-4">Usage</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {coupons.map(coupon => (
                        <tr key={coupon._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{coupon.code}</td>
                            <td className="px-6 py-4 text-gray-900 dark:text-gray-200">
                                {coupon.discountType === 'percentage' ? `${coupon.value}% Off` : `$${coupon.value} Off`}
                                <div className="text-xs text-gray-500 dark:text-gray-400">Min: ${coupon.minPurchase}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                {coupon.usedCount} / {coupon.usageLimit || '∞'}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${coupon.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => openEdit(coupon)} className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mr-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"><Edit2 size={16}/></button>
                                <button onClick={() => handleDelete(coupon._id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-4">
          {coupons.map(coupon => (
              <div key={coupon._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                          <Tag size={16} className="text-indigo-600 dark:text-indigo-400" />
                          <span className="font-mono font-bold text-lg text-gray-900 dark:text-white">{coupon.code}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${coupon.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Discount</p>
                          <p className="font-medium text-gray-900 dark:text-white">{coupon.discountType === 'percentage' ? `${coupon.value}% Off` : `$${coupon.value} Off`}</p>
                          <p className="text-xs text-gray-400">Min Purchase: ${coupon.minPurchase}</p>
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Usage</p>
                          <p className="font-medium text-gray-900 dark:text-white">{coupon.usedCount} / {coupon.usageLimit || '∞'}</p>
                      </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button 
                          onClick={() => openEdit(coupon)} 
                          className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium"
                      >
                          <Edit2 size={14} /> Edit
                      </button>
                      <button 
                          onClick={() => handleDelete(coupon._id)} 
                          className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium"
                      >
                          <Trash2 size={14} />
                      </button>
                  </div>
              </div>
          ))}
      </div>

      {coupons.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mt-4">
              No coupons created yet.
          </div>
      )}

      {isEditing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formData._id ? 'Edit' : 'New'} Coupon</h2>
                      <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleSave} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Coupon Code</label>
                          <input required type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 uppercase dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Type</label>
                              <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white outline-none" value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})}>
                                  <option value="percentage">Percentage</option>
                                  <option value="fixed">Fixed Amount</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Value</label>
                              <input required type="number" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white outline-none" value={formData.value || ''} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Min Purchase</label>
                              <input type="number" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white outline-none" value={formData.minPurchase || 0} onChange={e => setFormData({...formData, minPurchase: Number(e.target.value)})} />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Usage Limit</label>
                              <input type="number" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white outline-none" value={formData.usageLimit || ''} onChange={e => setFormData({...formData, usageLimit: Number(e.target.value)})} placeholder="∞" />
                          </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                          <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
                      </div>
                      <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 shadow-md mt-4 transition-transform active:scale-[0.98]">Save Coupon</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
    