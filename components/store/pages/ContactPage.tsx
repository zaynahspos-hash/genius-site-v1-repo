import React, { useState } from 'react';
import { pageService } from '../../../services/pageService';
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react';
import { useSettings } from '../../../contexts/SettingsContext';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
          await pageService.submitContact(formData);
          setSuccess(true);
          setFormData({ name: '', email: '', subject: '', message: '' });
      } catch(e) { alert('Failed to send'); }
      finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
                <div className="bg-indigo-50 p-8 rounded-2xl">
                    <h3 className="font-bold text-xl mb-6 text-indigo-900">Contact Information</h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white text-indigo-600 rounded-full shadow-sm"><Mail size={20}/></div>
                            <div>
                                <p className="font-medium text-gray-900">Email</p>
                                <p className="text-gray-600">{settings?.general?.storeEmail}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white text-indigo-600 rounded-full shadow-sm"><Phone size={20}/></div>
                            <div>
                                <p className="font-medium text-gray-900">Phone</p>
                                <p className="text-gray-600">{settings?.general?.storePhone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white text-indigo-600 rounded-full shadow-sm"><MapPin size={20}/></div>
                            <div>
                                <p className="font-medium text-gray-900">Office</p>
                                <p className="text-gray-600">
                                    {settings?.general?.address?.street}<br/>
                                    {settings?.general?.address?.city}, {settings?.general?.address?.state}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {success ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                        <p className="text-gray-500">Thanks for reaching out. We'll get back to you shortly.</p>
                        <button onClick={() => setSuccess(false)} className="mt-6 text-indigo-600 font-medium">Send another</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input required className="w-full border rounded-lg px-4 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input required type="email" className="w-full border rounded-lg px-4 py-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Subject</label>
                            <input className="w-full border rounded-lg px-4 py-2" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Message</label>
                            <textarea required className="w-full border rounded-lg px-4 py-2" rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                        </div>
                        <button disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading && <Loader2 className="animate-spin" size={18} />} Send Message
                        </button>
                    </form>
                )}
            </div>
        </div>
    </div>
  );
};