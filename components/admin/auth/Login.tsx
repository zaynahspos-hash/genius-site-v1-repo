import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { Unlock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDirectAccess = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Send dummy credentials - the backend is now configured to ignore them and let you in
      await authService.login('admin@dev.com', 'bypass');
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
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

            <div className="flex items-center justify-center gap-2 text-xs text-green-600 font-medium bg-green-50 py-2 rounded-lg">
                <ShieldCheck size={14} /> Direct Access Active
            </div>
        </div>
      </div>
    </div>
  );
};