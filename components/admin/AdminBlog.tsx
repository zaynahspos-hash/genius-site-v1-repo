
import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import { Plus, Edit2, Trash2, FileText, Folder, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { BlogPostEditor } from './BlogPostEditor';

export const AdminBlog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  
  // Category Editor
  const [editingCategory, setEditingCategory] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
        const [p, c] = await Promise.all([
            blogService.getPosts(true),
            blogService.getCategories()
        ]);
        setPosts(p);
        setCategories(c);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDeletePost = async (id: string) => {
      if(confirm('Delete post?')) {
          await blogService.deletePost(id);
          loadData();
      }
  };

  const handleSaveCategory = async () => {
      if(!editingCategory?.name) return;
      try {
          await blogService.saveCategory(editingCategory);
          setEditingCategory(null);
          loadData();
      } catch(e) { alert('Failed'); }
  };

  const handleDeleteCategory = async (id: string) => {
      if(confirm('Delete category?')) {
          await blogService.deleteCategory(id);
          loadData();
      }
  };

  if (isEditingPost) {
      return <BlogPostEditor 
                post={editingPost} 
                categories={categories} 
                onSave={() => { setIsEditingPost(false); loadData(); }} 
                onCancel={() => setIsEditingPost(false)} 
             />;
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
            <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                <button 
                    onClick={() => setActiveTab('posts')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'posts' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Posts
                </button>
                <button 
                    onClick={() => setActiveTab('categories')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Categories
                </button>
            </div>
        </div>

        {activeTab === 'posts' ? (
            <>
                <div className="flex justify-end mb-4">
                    <button onClick={() => { setEditingPost(null); setIsEditingPost(true); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 shadow-sm">
                        <Plus size={16} /> New Post
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <BookOpen size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No posts yet</h3>
                        <p className="text-gray-500 mb-6 max-w-sm">Share news, updates, or stories with your customers.</p>
                        <button 
                            onClick={() => { setEditingPost(null); setIsEditingPost(true); }}
                            className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Write Your First Post
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {posts.map(post => (
                                        <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold capitalize 
                                                    ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {post.status === 'published' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                                                    {post.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{post.category?.name || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(post.publishDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button onClick={() => { setEditingPost(post); setIsEditingPost(true); }} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded"><Edit2 size={16}/></button>
                                                <button onClick={() => handleDeletePost(post._id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white p-6 rounded-xl border border-gray-100 h-fit shadow-sm">
                    <h3 className="font-bold mb-4 text-gray-900">{editingCategory?._id ? 'Edit Category' : 'Add Category'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. News" value={editingCategory?.name || ''} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" rows={3} placeholder="Optional" value={editingCategory?.description || ''} onChange={e => setEditingCategory({...editingCategory, description: e.target.value})} />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={handleSaveCategory} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium">Save</button>
                            {editingCategory && <button onClick={() => setEditingCategory(null)} className="px-4 border rounded-lg hover:bg-gray-50 text-gray-600">Cancel</button>}
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Posts</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No categories found.</td>
                                    </tr>
                                ) : categories.map(cat => (
                                    <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{cat.count}</td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button onClick={() => setEditingCategory(cat)} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded"><Edit2 size={16}/></button>
                                            <button onClick={() => handleDeleteCategory(cat._id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
