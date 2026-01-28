import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { Unlock, Loader2, ArrowRight, ShieldCheck, Activity, CheckCircle, XCircle, Server, Database, Key } from 'lucide-react';
import { API_BASE_URL } from '../../../services/apiConfig';

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagData, setDiagData] = useState<any>(null);
  const [diagLoading, setDiagLoading] = useState(false);
  const navigate = useNavigate();

  const handleDirectAccess = async () => {
    setLoading(true);
    setError('');
    
    try {
      await authService.login('admin@dev.com', 'bypass');
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const runDiagnostics = async () => {
      setDiagLoading(true);
      setShowDiagnostics(true);
      setDiagData(null);
      try {
          const res = await fetch(`${API_BASE_URL}/health/system`);
          if (!res.ok) throw new Error('Backend Unreachable');
          const data = await res.json();
          setDiagData(data);
      } catch (e: any) {
          setDiagData({ error: e.message || 'Network Error' });
      } finally {
          setDiagLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-xl">
            <Unlock size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Developer Mode Enabled
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="text-center mb-6">
                <p className="text-gray-500 mb-4">Password protection has been temporarily disabled for your session.</p>
                
                <button
                    onClick={handleDirectAccess}
                    disabled={loading}
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all transform hover:-translate-y-1"
                >
                    {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                    <>
                        Enter Admin Panel <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                    )}
                </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-green-600 font-medium bg-green-50 py-2 rounded-lg mb-4">
                <ShieldCheck size={14} /> Direct Access Active
            </div>

            <div className="text-center pt-4 border-t border-gray-100">
                <button 
                    onClick={runDiagnostics}
                    className="text-xs text-gray-400 hover:text-indigo-600 flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                    <Activity size={14} /> Having trouble? Run Diagnostics
                </button>
            </div>
        </div>
      </div>

      {/* Diagnostics Modal */}
      {showDiagnostics && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
                  <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                      <h3 className="font-bold flex items-center gap-2"><Activity size={18}/> System Health Doctor</h3>
                      <button onClick={() => setShowDiagnostics(false)} className="text-gray-400 hover:text-white">✕</button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      {diagLoading ? (
                          <div className="flex flex-col items-center justify-center py-8">
                              <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
                              <p className="text-sm text-gray-500">Checking connections...</p>
                          </div>
                      ) : diagData?.error ? (
                          <div className="text-center py-4">
                              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <XCircle size={24} />
                              </div>
                              <h4 className="font-bold text-red-600 mb-1">Connection Failed</h4>
                              <p className="text-sm text-gray-600">{diagData.error}</p>
                              <p className="text-xs text-gray-400 mt-2 bg-gray-100 p-2 rounded">Check if Backend is running on Port 5000</p>
                          </div>
                      ) : (
                          <>
                              {/* Backend Status */}
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                      <Server size={18} className="text-gray-500"/>
                                      <span className="text-sm font-medium">Backend Server</span>
                                  </div>
                                  <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                      <CheckCircle size={12}/> Online
                                  </span>
                              </div>

                              {/* DB Status */}
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                      <Database size={18} className="text-gray-500"/>
                                      <span className="text-sm font-medium">Database</span>
                                  </div>
                                  {diagData?.database?.connected ? (
                                      <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                          <CheckCircle size={12}/> Connected
                                      </span>
                                  ) : (
                                      <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                                          <XCircle size={12}/> {diagData?.database?.status}
                                      </span>
                                  )}
                              </div>

                              {/* Env Status */}
                              <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3 mb-2">
                                      <Key size={18} className="text-gray-500"/>
                                      <span className="text-sm font-medium">Environment Keys</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                      <span className={diagData?.environment?.HAS_MONGO_URI ? 'text-green-600' : 'text-red-600'}>
                                          {diagData?.environment?.HAS_MONGO_URI ? '✓' : '✗'} Mongo URI
                                      </span>
                                      <span className={diagData?.environment?.HAS_API_KEY ? 'text-green-600' : 'text-red-600'}>
                                          {diagData?.environment?.HAS_API_KEY ? '✓' : '✗'} Gemini AI
                                      </span>
                                      <span className={diagData?.environment?.HAS_JWT_SECRET ? 'text-green-600' : 'text-red-600'}>
                                          {diagData?.environment?.HAS_JWT_SECRET ? '✓' : '✗'} JWT Secret
                                      </span>
                                      <span className={diagData?.environment?.HAS_CLOUDINARY ? 'text-green-600' : 'text-red-600'}>
                                          {diagData?.environment?.HAS_CLOUDINARY ? '✓' : '✗'} Cloudinary
                                      </span>
                                  </div>
                              </div>
                          </>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};