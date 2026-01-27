import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/customerService';
import { Loader2 } from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = customerService.getCurrentUser();
    if (user) {
        setFormData({ name: user.name, email: user.email, password: '' });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
        await customerService.updateProfile(formData);
        setMessage('Profile updated successfully!');
    } catch (err) {
        setMessage('Failed to update profile.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            {message && (
                <div className={`p-4 rounded-lg mb-4 text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                    <input 
                        type="password" 
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="••••••••"
                    />
                </div>
                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};