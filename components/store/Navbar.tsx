import React from 'react';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { useSettings } from '../../contexts/SettingsContext';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = customerService.getCurrentUser();
  const { settings } = useSettings();

  const isActive = (path: string) => {
      return location.pathname === path ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-900";
  };

  const storeName = settings?.general?.storeName || 'ShopGenius';
  const logoUrl = settings?.general?.logoUrl;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              <Menu size={24} className="text-gray-600" />
            </button>
            <div 
              onClick={() => onNavigate('/')}
              className="text-2xl font-bold text-gray-900 tracking-tight cursor-pointer flex items-center gap-2"
            >
              {logoUrl ? (
                  <img src={logoUrl} alt={storeName} className="h-8 w-auto object-contain" />
              ) : (
                <>
                  <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-serif text-xl">
                      {storeName.charAt(0)}
                  </div>
                  {storeName}
                </>
              )}
            </div>
            <div className="hidden md:flex ml-8 space-x-8">
              <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/')}`}>Home</Link>
              <Link to="/shop" className={`text-sm font-medium transition-colors ${isActive('/shop')}`}>Catalog</Link>
              <Link to="/about" className={`text-sm font-medium transition-colors ${isActive('/about')}`}>About</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Account Link */}
            {user ? (
                <button 
                  onClick={() => navigate('/account')}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
                >
                    <User size={20} />
                    <span className="hidden sm:inline">My Account</span>
                </button>
            ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >
                    Sign In
                </button>
            )}

            <div className="h-4 w-px bg-gray-200 mx-1 hidden md:block"></div>

            <button 
              onClick={() => onNavigate('/admin')}
              className="hidden md:block text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
            >
              Admin View
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search size={20} className="text-gray-600" />
            </button>
            <button 
              onClick={onOpenCart}
              className="p-2 hover:bg-gray-100 rounded-full relative group"
            >
              <ShoppingBag size={20} className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};