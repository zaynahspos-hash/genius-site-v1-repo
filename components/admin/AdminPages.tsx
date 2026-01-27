
import React, { useEffect, useState } from 'react';
import { pageService } from '../../services/pageService';
import { Plus, Edit2, Trash2, Eye, FileText } from 'lucide-react';
import { PageEditor } from './PageEditor';

export const AdminPages: React.FC = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
      setLoading(true);
      try {
          const data = await pageService.getAllPages();
          setPages(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
      if(confirm('Delete this page?')) {
          await pageService.deletePage(id);
          loadPages();
      }
  };

  if (isEditing) {
      return <PageEditor page={editingPage} onSave={() => { setIsEditing(false); loadPages(); }} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Pages</h1>
            <button onClick={() => { setEditingPage(null); setIsEditing(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                <Plus size={18} /> Add Page
            </button>
        </div>

        {loading ? (
            <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">Loading pages...</div>
        ) : pages.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No pages found</h3>
                <p className="text-gray-500 mb-6 max-w-sm">Create content pages like "About Us", "Contact", or "Terms of Service" for your store.</p>
                <button 
                    onClick={() => { setEditingPage(null); setIsEditing(true); }}
                    className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                    Create Your First Page
                </button>
            </div>
        ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Template</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pages.map(page => (
                                <tr key={page._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {page.title}
                                        {page.showInNav && <span className="ml-2 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded">Nav</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">/{page.slug}</td>
                                    <td className="px-6 py-4 text-sm capitalize">{page.template}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {page.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => { setEditingPage(page); setIsEditing(true); }} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded"><Edit2 size={16}/></button>
                                        <button onClick={() => handleDelete(page._id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
  );
};
