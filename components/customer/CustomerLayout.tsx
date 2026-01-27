
import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation, Routes, Route } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { User, Package, MapPin, Heart, Settings, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { AccountDashboard } from './AccountDashboard';
import { OrderHistory } from './OrderHistory';
import { OrderDetail } from './OrderDetail';
import { AddressBook } from './AddressBook';
import { Wishlist } from './Wishlist';
import { ProfileSettings } from './ProfileSettings';

export const CustomerLayout: React.FC = () => {
  const user = customerService.getCurrentUser();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    customerService.logout();
    window.location.href = '/login';
  };

  const navItems = [
    { path: '/account', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/account/orders', label: 'Order History', icon: Package },
    { path: '/account/addresses', label: 'Addresses', icon: MapPin },
    { path: '/account/wishlist', label: 'Wishlist', icon: Heart },
    { path: '/account/settings', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-500 text-sm">Hi, {user.name.split(' ')[0]}</p>
            </div>
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-500">Welcome back, {user.name}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Sidebar */}
          <div className={`
              fixed md:static inset-0 z-40 bg-gray-50 md:bg-transparent p-4 md:p-0 transition-transform duration-300 md:translate-x-0 md:w-64 flex-shrink-0
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            {/* Mobile Close Button Overlay */}
            <div className="md:hidden flex justify-end mb-4">
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white rounded-full shadow-sm">
                    <X size={20} />
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                <nav className="flex flex-col p-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                location.pathname === item.path || (item.path !== '/account' && location.pathname.startsWith(item.path))
                                    ? 'bg-indigo-50 text-indigo-600' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left mt-2 border-t border-gray-50"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </nav>
            </div>
          </div>

          {/* Mobile Backdrop */}
          {mobileMenuOpen && (
              <div className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          )}

          {/* Content Area */}
          <div className="flex-1 min-w-0">
             <Routes>
                 <Route index element={<AccountDashboard />} />
                 <Route path="orders" element={<OrderHistory />} />
                 <Route path="orders/:id" element={<OrderDetail />} />
                 <Route path="addresses" element={<AddressBook />} />
                 <Route path="wishlist" element={<Wishlist />} />
                 <Route path="settings" element={<ProfileSettings />} />
             </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};
