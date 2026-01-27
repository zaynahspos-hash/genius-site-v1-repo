
import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Store, Users, Layers, 
  ChevronDown, ChevronRight, Star, Tag, FileText, Menu as MenuIcon, ChevronLeft,
  BookOpen, MessageCircle, BarChart2, Image as ImageIcon, Navigation, X
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, setActiveTab, onNavigate, isCollapsed, toggleCollapse, mobileOpen, setMobileOpen 
}) => {
  const { settings } = useSettings();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    products: true,
    orders: false,
    settings: false
  });

  const toggleSubmenu = (key: string) => {
    if (isCollapsed) toggleCollapse();
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Analytics', icon: BarChart2 },
    { 
      id: 'products', label: 'Products', icon: Package,
      submenu: [
        { id: 'products', label: 'All Products' },
        { id: 'products-add', label: 'Add New' },
        { id: 'categories', label: 'Categories' },
        { id: 'collections', label: 'Collections' },
        { id: 'inventory', label: 'Inventory' },
      ]
    },
    { 
      id: 'orders', label: 'Orders', icon: ShoppingCart,
      submenu: [
        { id: 'orders', label: 'All Orders' },
        { id: 'orders-pending', label: 'Pending' },
        { id: 'orders-processing', label: 'Processing' },
        { id: 'orders-completed', label: 'Completed' },
      ]
    },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { 
      id: 'content', label: 'Online Store', icon: Store,
      submenu: [
        { id: 'homepage', label: 'Customizer' },
        { id: 'menus', label: 'Navigation' },
        { id: 'pages', label: 'Pages' },
        { id: 'blog', label: 'Blog Posts' },
      ]
    },
    { id: 'contact', label: 'Messages', icon: MessageCircle }, 
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'settings', label: 'Settings', icon: Settings,
      submenu: [
        { id: 'settings', label: 'General' },
        { id: 'settings-theme', label: 'Theme' }, 
        { id: 'settings-payment', label: 'Payment' },
        { id: 'settings-shipping', label: 'Shipping' },
        { id: 'settings-email', label: 'Email' }, 
        { id: 'settings-tax', label: 'Tax' }, 
      ]
    },
  ];

  const handleItemClick = (itemId: string, hasSubmenu: boolean) => {
      if (hasSubmenu) {
          toggleSubmenu(itemId);
      } else {
          setActiveTab(itemId);
          setMobileOpen(false); // Close sidebar on mobile when clicked
      }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
          fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40 flex flex-col transition-all duration-300 shadow-xl md:shadow-none
          ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'} 
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
      `}>
        <div className={`h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold shadow-sm shrink-0">
              {settings?.general?.storeName?.[0] || 'S'}
            </div>
            {(!isCollapsed || mobileOpen) && (
                <span className="font-bold text-gray-800 dark:text-white text-lg tracking-tight truncate max-w-[120px]">
                    {settings?.general?.storeName || 'ShopGenius'}
                </span>
            )}
          </div>
          {/* Mobile Close Button */}
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-gray-500 dark:text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          {(!isCollapsed || mobileOpen) && <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-4">Menu</div>}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                  <button
                      onClick={() => handleItemClick(item.id, !!item.submenu)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          activeTab.startsWith(item.id) && !item.submenu
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                      title={isCollapsed ? item.label : ''}
                  >
                      <div className={`flex items-center gap-3 ${isCollapsed && !mobileOpen ? 'justify-center w-full' : ''}`}>
                          <item.icon size={20} className={activeTab.startsWith(item.id) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'} />
                          {(!isCollapsed || mobileOpen) && <span>{item.label}</span>}
                      </div>
                      {(!isCollapsed || mobileOpen) && item.submenu && (
                          expandedMenus[item.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                      )}
                  </button>

                  {/* Submenu */}
                  {(!isCollapsed || mobileOpen) && item.submenu && expandedMenus[item.id] && (
                      <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 pl-2">
                          {item.submenu.map(sub => (
                              <button
                                  key={sub.id}
                                  onClick={() => { 
                                      if(sub.id === 'homepage') onNavigate('/admin/customizer'); 
                                      else setActiveTab(sub.id);
                                      setMobileOpen(false);
                                  }} 
                                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeTab === sub.id ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                              >
                                  {sub.label}
                              </button>
                          ))}
                      </div>
                  )}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2 bg-gray-50/50 dark:bg-gray-900">
          <button 
            onClick={() => toggleCollapse()}
            className="w-full hidden md:flex items-center justify-center p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
              <button 
              onClick={() => onNavigate('/')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-sm rounded-lg transition-all ${isCollapsed && !mobileOpen ? 'justify-center' : ''}`}
              title="View Store"
              >
              <Store size={18} className="text-gray-500 dark:text-gray-400" />
              {(!isCollapsed || mobileOpen) && 'View Store'}
              </button>
              <button 
                  onClick={() => onNavigate('/admin/login')} 
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${isCollapsed && !mobileOpen ? 'justify-center' : ''}`}
              >
              <LogOut size={18} />
              {(!isCollapsed || mobileOpen) && 'Logout'}
              </button>
          </div>
        </div>
      </div>
    </>
  );
};
