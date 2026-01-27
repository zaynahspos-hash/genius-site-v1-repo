
import React, { useState } from 'react';
import { blogService } from '../../services/blogService';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { RichTextEditor } from './common/RichTextEditor';
import { ImagePicker } from './common/ImagePicker';

interface BlogPostEditorProps {
    post: any;
    categories: any[];
    onSave: () => void;
    onCancel: () => void;
}

export const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ post, categories, onSave, onCancel }) => {
    const [formData, setFormData] = useState<any>(post || {
        title: '', content: '', status: 'draft', category: '', tags: [], excerpt: '', publishDate: new Date().toISOString().split('T')[0], image: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await blogService.savePost(formData);
            onSave();
        } catch(e) { alert('Failed to save'); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-6">
                <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <ArrowLeft size={20} /> Back
                </button>
                <h1 className="text-xl font-bold">{post ? 'Edit Post' : 'New Post'}</h1>
                <button disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Save
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <label className="block text-sm font-medium">Title</label>
                        <input required className="w-full border rounded-lg px-4 py-2 text-lg font-medium" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        
                        <label className="block text-sm font-medium">Content</label>
                        <RichTextEditor 
                            value={formData.content} 
                            onChange={val => setFormData({...formData, content: val})} 
                            height="min-h-[400px]"
                        />
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <label className="block text-sm font-medium">Excerpt</label>
                        <textarea className="w-full border rounded-lg px-3 py-2" rows={3} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-900">Publishing</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select className="w-full border rounded-lg px-3 py-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input type="date" className="w-full border rounded-lg px-3 py-2" value={new Date(formData.publishDate).toISOString().split('T')[0]} onChange={e => setFormData({...formData, publishDate: e.target.value})} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-900">Organization</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select className="w-full border rounded-lg px-3 py-2" value={formData.category?._id || formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option value="">Uncategorized</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <ImagePicker 
                            label="Featured Image"
                            multiple={false}
                            images={formData.image ? [formData.image] : []}
                            onChange={(imgs) => setFormData({...formData, image: imgs[0] || ''})}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};
