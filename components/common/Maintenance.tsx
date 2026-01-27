import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface MaintenanceProps {
    message?: string;
}

export const Maintenance: React.FC<MaintenanceProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Under Maintenance</h1>
            <p className="text-gray-600 mb-6">
                {message || "We are currently improving our store. Please check back later."}
            </p>
            <div className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Store Admin
            </div>
        </div>
    </div>
  );
};