
import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { Plus, Trash2, GripVertical, Save, Edit2, ChevronDown, ChevronRight, Menu as MenuIcon, Link as LinkIcon, Folder } from 'lucide-react';

export const AdminMenus: React.FC = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      const data = await settingsService.getMenus();
      setMenus(data);
      if (data.length > 0) {
          // Select Main Menu by default or first
          const main = data.find((m: any) => m.handle === 'main') || data[0];
          selectMenu(main);
      } else {
          // Initialize defaults if empty
          const defaults = [
              { handle: 'main', title: 'Main Menu', items: [] },
              { handle: 'footer', title: 'Footer Menu', items: [] }
          ];
          setMenus(defaults);
          selectMenu(defaults[0]);
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const selectMenu = (menu: any) => {
      setSelectedMenu(menu);
      setItems(JSON.parse(JSON.stringify(menu.items || [])));
  };

  const handleAddItem = () => {
      setItems([...items, { title: 'New Item', url: '/', type: 'link' }]);
  };

  const updateItem = (index: number, field: string, value: string) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      setItems(newItems);
  };

  const removeItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
      const newItems = [...items];
      if (direction === 'up' && index > 0) {
          [newItems[index], newItems[index-1]] = [newItems[index-1], newItems[index]];
      } else if (direction === 'down' && index < newItems.length - 1) {
          [newItems[index], newItems[index+1]] = [newItems[index+1], newItems[index]];
      }
      setItems(newItems);
  };

  const handleSave = async () => {
      if(!selectedMenu) return;
      setSaving(true);
      try {
          const updatedMenu = { ...selectedMenu, items };
          await settingsService.saveMenu(updatedMenu);
          
          // Update local list
          setMenus(menus.map(m => m.handle === updatedMenu.handle ? updatedMenu : m));
          alert('Menu saved successfully!');
      } catch(e) { alert('Failed to save menu'); }
      finally { setSaving(false); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Navigation</h1>
            <button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50">
                <Save size={18} /> {saving ? 'Saving...' : 'Save Menu'}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar List */}
            <div className="col-span-1 space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Menus</h3>
                {menus.map(menu => (
                    <button
                        key={menu.handle}
                        onClick={() => selectMenu(menu)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors
                            ${selectedMenu?.handle === menu.handle ? 'bg-white shadow-sm text-indigo-600 border border-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <MenuIcon size={16} />
                        {menu.title}
                    </button>
                ))}
            </div>

            {/* Editor */}
            <div className="col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="mb-6 pb-6 border-b border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Menu Title</label>
                        <input 
                            className="w-full border rounded-lg px-3 py-2 font-medium text-gray-900" 
                            value={selectedMenu?.title || ''}
                            onChange={e => setSelectedMenu({...selectedMenu, title: e.target.value})}
                        />
                        <p className="text-xs text-gray-500 mt-1">Handle: <span className="font-mono">{selectedMenu?.handle}</span></p>
                    </div>

                    <div className="space-y-3">
                        {items.map((item, idx) => (
                            <div key={idx} className="group bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-3 hover:border-indigo-300 transition-colors">
                                <div className="flex flex-col gap-1 mt-2 text-gray-400">
                                    <button onClick={() => moveItem(idx, 'up')} disabled={idx === 0} className="hover:text-indigo-600 disabled:opacity-20"><ChevronDown size={14} className="rotate-180"/></button>
                                    <GripVertical size={14} />
                                    <button onClick={() => moveItem(idx, 'down')} disabled={idx === items.length - 1} className="hover:text-indigo-600 disabled:opacity-20"><ChevronDown size={14}/></button>
                                </div>
                                
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Label</label>
                                        <input 
                                            className="w-full border rounded px-2 py-1.5 text-sm" 
                                            value={item.title} 
                                            onChange={e => updateItem(idx, 'title', e.target.value)}
                                            placeholder="e.g. Home"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Link / URL</label>
                                        <div className="relative">
                                            <input 
                                                className="w-full border rounded px-2 py-1.5 text-sm pl-8" 
                                                value={item.url} 
                                                onChange={e => updateItem(idx, 'url', e.target.value)}
                                                placeholder="/shop"
                                            />
                                            <LinkIcon size={14} className="absolute left-2.5 top-2 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => removeItem(idx)} className="mt-2 text-gray-400 hover:text-red-600 p-1">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        {items.length === 0 && (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                This menu is empty.
                            </div>
                        )}

                        <button onClick={handleAddItem} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 font-medium hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                            <Plus size={18} /> Add Menu Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
