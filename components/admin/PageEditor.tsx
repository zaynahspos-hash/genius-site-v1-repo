
import React, { useState } from 'react';
import { pageService } from '../../services/pageService';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { RichTextEditor } from './common/RichTextEditor';

interface PageEditorProps {
    page: any;
    onSave: () => void;
    onCancel: () => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({ page, onSave, onCancel }) => {
    const [formData, setFormData] = useState<any>(page || {
        title: '', slug: '', content: '', template: 'default', status: 'published', showInNav: false
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await pageService.savePage(formData);
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
                <h1 className="text-xl font-bold">{page ? 'Edit Page' : 'New Page'}</h1>
                <button disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Save
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <label className="block text-sm font-medium">Page Title</label>
                        <input required className="w-full border rounded-lg px-4 py-2 text-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        
                        <label className="block text-sm font-medium">Slug (URL)</label>
                        <input className="w-full border rounded-lg px-3 py-2 text-sm text-gray-600" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="auto-generated" />

                        <label className="block text-sm font-medium">Content</label>
                        <RichTextEditor 
                            value={formData.content} 
                            onChange={val => setFormData({...formData, content: val})} 
                            height="min-h-[400px]"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-900">Settings</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select className="w-full border rounded-lg px-3 py-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Template</label>
                            <select className="w-full border rounded-lg px-3 py-2" value={formData.template} onChange={e => setFormData({...formData, template: e.target.value})}>
                                <option value="default">Default</option>
                                <option value="full-width">Full Width</option>
                                <option value="contact">Contact Page</option>
                                <option value="about">About Page</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" checked={formData.showInNav} onChange={e => setFormData({...formData, showInNav: e.target.checked})} />
                            <label className="text-sm">Show in Main Navigation</label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
