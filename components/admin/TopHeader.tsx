
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Plus, Menu, Sun, Moon, LogOut, Settings, User, ExternalLink, ChevronDown, X } from 'lucide-react';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

interface TopHeaderProps {
  sidebarOpen: boolean;
  onMobileMenuClick: () => void;
  onAddProduct: () => void;
  setActiveTab: (tab: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ sidebarOpen, onMobileMenuClick, onAddProduct, setActiveTab }) => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node) && !(event.target as Element).closest('.notif-dropdown')) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
      authService.logout();
      navigate('/admin/login');
  };

  return (
    <header className={`h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 z-20 transition-all duration-300 flex items-center justify-between px-4 md:px-6 shadow-sm
       left-0 ${sidebarOpen ? 'md:left-64' : 'md:left-20'}`}>
        
        {/* Left: Mobile Toggle & Search */}
        <div className="flex items-center gap-3 flex-1">
            <button 
              onClick={onMobileMenuClick}
              className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>

            <div className="relative w-full max-w-md hidden md:block">
                <span className="absolute left-3 top-2.5 text-gray-400">
                    <Search size={18} />
                </span>
                <input 
                    type="text" 
                    placeholder="Search orders, products, customers..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-gray-200 dark:placeholder-gray-400"
                />
                <div className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium border border-gray-300 dark:border-gray-600 rounded px-1.5 hidden lg:block">⌘K</div>
            </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
            <button 
                onClick={() => window.open('/', '_blank')}
                className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                title="View Storefront"
            >
                <ExternalLink size={18} />
            </button>

            <button 
                onClick={onAddProduct}
                className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
                <Plus size={16} />
                <span>Add Product</span>
            </button>
            <button 
                onClick={onAddProduct}
                className="sm:hidden flex items-center justify-center bg-indigo-600 text-white w-8 h-8 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
                <Plus size={18} />
            </button>
            
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

            <button 
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none"
                title="Toggle Theme"
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
                <button 
                    ref={notifRef}
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
                </button>
                
                {notifOpen && (
                    <div className="notif-dropdown absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in zoom-in duration-200 z-50">
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <span className="font-bold text-sm dark:text-white">Notifications</span>
                            <span className="text-xs text-indigo-600 cursor-pointer">Mark all read</span>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-50 dark:border-gray-700 last:border-0">
                                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">New Order #1024</p>
                                <p className="text-xs text-gray-500">Received 5 minutes ago</p>
                            </div>
                            <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-50 dark:border-gray-700 last:border-0">
                                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">Low Stock Warning</p>
                                <p className="text-xs text-gray-500">Nike Air Max is running low</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
                <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 rounded-lg transition-colors outline-none"
                >
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold">
                        {user?.name?.[0] || 'A'}
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200 leading-none">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Super Admin</p>
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 animate-in fade-in zoom-in duration-200 z-50">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                            <button 
                                onClick={() => { setActiveTab('settings'); setProfileOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <Settings size={16} /> Settings
                            </button>
                            <button 
                                onClick={() => { setActiveTab('account'); setProfileOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <User size={16} /> Profile
                            </button>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                                <LogOut size={16} /> Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </header>
  );
};
