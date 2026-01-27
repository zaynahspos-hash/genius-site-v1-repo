import React, { useEffect, useState } from 'react';
import { pageService } from '../../services/pageService';
import { Mail, MessageSquare, Check, Clock } from 'lucide-react';

export const AdminContact: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
      try {
          const data = await pageService.getSubmissions();
          setSubmissions(data);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
  };

  const handleStatus = async (id: string, status: string) => {
      try {
          await pageService.updateSubmission(id, { status });
          loadSubmissions();
      } catch(e) { alert('Failed'); }
  };

  return (
    <div className="animate-in fade-in duration-500">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Submissions</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
                {submissions.map(sub => (
                    <div key={sub._id} className={`p-6 hover:bg-gray-50 transition-colors ${sub.status === 'new' ? 'bg-indigo-50/30' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${sub.status === 'new' ? 'bg-indigo-500' : 'bg-gray-300'}`}></span>
                                <h3 className="font-bold text-gray-900">{sub.subject}</h3>
                            </div>
                            <div className="text-xs text-gray-500">{new Date(sub.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <Mail size={14}/> {sub.email} 
                            <span className="text-gray-300">|</span> 
                            <span>{sub.name}</span>
                        </div>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap">{sub.message}</p>
                        
                        <div className="mt-4 flex gap-2">
                            {sub.status === 'new' && (
                                <button onClick={() => handleStatus(sub._id, 'read')} className="text-xs flex items-center gap-1 bg-white border px-3 py-1.5 rounded hover:bg-gray-50">
                                    <Check size={12}/> Mark Read
                                </button>
                            )}
                            <a href={`mailto:${sub.email}?subject=Re: ${sub.subject}`} className="text-xs flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700">
                                <MessageSquare size={12}/> Reply
                            </a>
                        </div>
                    </div>
                ))}
                {submissions.length === 0 && <div className="p-8 text-center text-gray-500">No messages found.</div>}
            </div>
        </div>
    </div>
  );
};