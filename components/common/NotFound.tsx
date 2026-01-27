import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-9xl font-bold text-indigo-100">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="mt-8 flex gap-4">
            <Link to="/" className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                <Home size={18} /> Go Home
            </Link>
            <Link to="/shop" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                <Search size={18} /> Browse Shop
            </Link>
        </div>
    </div>
  );
};