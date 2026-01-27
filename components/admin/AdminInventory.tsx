import React, { useEffect, useState } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { Search, Filter, Save, AlertTriangle, Download, Check, Edit2 } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
      let res = inventory;
      if (search) {
          res = res.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()));
      }
      if (filter === 'low') {
          res = res.filter(i => i.stock <= 10 && i.stock > 0);
      } else if (filter === 'out') {
          res = res.filter(i => i.stock === 0);
      }
      setFiltered(res);
  }, [search, filter, inventory]);

  const fetchInventory = async () => {
      try {
          const data = await inventoryService.getInventory();
          setInventory(data);
          setFiltered(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const startEdit = (item: any) => {
      setEditingId(item.variantId || item.id);
      setTempStock(item.stock);
  };

  const saveStock = async (item: any) => {
      try {
          await inventoryService.updateStock(item.id, item.isVariant ? item.variantId : undefined, tempStock);
          setInventory(inventory.map(i => {
              const key = i.variantId || i.id;
              const targetKey = item.variantId || item.id;
              if (key === targetKey) return { ...i, stock: tempStock };
              return i;
          }));
          setEditingId(null);
      } catch (err) { alert('Update failed'); }
  };

  const exportCSV = () => {
      const headers = ['Product', 'Variant', 'SKU', 'Stock'];
      const rows = filtered.map(i => [i.title, i.variantName, i.sku, i.stock]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", "inventory.csv");
      document.body.appendChild(link);
      link.click();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
        <div className="flex gap-2">
            <button onClick={exportCSV} className="bg-white border text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                <Download size={16} /> Export CSV
            </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2">
              {['all', 'low', 'out'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {f === 'low' ? 'Low Stock' : f === 'out' ? 'Out of Stock' : 'All Items'}
                  </button>
              ))}
          </div>
          <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input type="text" placeholder="Search SKU or Name" className="w-full pl-10 pr-4 py-2 border rounded-lg" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b">
                  <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">SKU</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Status</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {filtered.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                      <img src={item.image || 'https://via.placeholder.com/40'} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                      <div className="font-medium text-gray-900">{item.title}</div>
                                      {item.isVariant && <div className="text-sm text-gray-500">{item.variantName}</div>}
                                  </div>
                              </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-gray-600">{item.sku}</td>
                          <td className="px-6 py-4">
                              {(editingId === (item.variantId || item.id)) ? (
                                  <div className="flex items-center gap-2">
                                      <input 
                                        type="number" 
                                        className="w-20 border rounded px-2 py-1 text-sm" 
                                        value={tempStock} 
                                        onChange={e => setTempStock(Number(e.target.value))}
                                        autoFocus
                                      />
                                      <button onClick={() => saveStock(item)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={16}/></button>
                                  </div>
                              ) : (
                                  <div onClick={() => startEdit(item)} className="cursor-pointer hover:text-indigo-600 flex items-center gap-2 group">
                                      <span className="font-medium">{item.stock}</span>
                                      <Edit2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                              )}
                          </td>
                          <td className="px-6 py-4 text-right">
                              {item.stock === 0 ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>
                              ) : item.stock <= 10 ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Low Stock</span>
                              ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
                              )}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
};