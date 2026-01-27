
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, Navigate, Outlet, useOutletContext } from 'react-router-dom';

// Admin Components
import { Sidebar } from './components/admin/Sidebar';
import { TopHeader } from './components/admin/TopHeader'; 
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminCoupons } from './components/admin/AdminCoupons';
import { Dashboard } from './components/admin/Dashboard';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminCollections } from './components/admin/AdminCollections';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminReviews } from './components/admin/AdminReviews'; 
import { AdminBlog } from './components/admin/AdminBlog';
import { AdminPages } from './components/admin/AdminPages';
import { AdminMenus } from './components/admin/AdminMenus'; 
import { AdminContact } from './components/admin/AdminContact';
import { AdminReports } from './components/admin/reports/AdminReports';
import { AdminMedia } from './components/admin/AdminMedia'; 
import { ProductEditor } from './components/admin/ProductEditor'; 
import { HomepageCustomizer } from './components/admin/customizer/HomepageCustomizer'; 
import { Login } from './components/admin/auth/Login';
import { Register } from './components/admin/auth/Register';
import { ForgotPassword } from './components/admin/auth/ForgotPassword';
import { ResetPassword } from './components/admin/auth/ResetPassword';
import { authService } from './services/authService';

// Store Components
import { Header } from './components/store/layout/Header';
import { Footer } from './components/store/layout/Footer';
import { AnnouncementBar } from './components/store/layout/AnnouncementBar';
import { SearchModal } from './components/store/layout/SearchModal';
import { StoreHome } from './components/store/StoreHome';
import { CollectionPage } from './components/store/CollectionPage';
import { ProductDetails } from './components/store/ProductDetails';
import { Checkout } from './components/store/Checkout';
import { CartPage } from './components/store/CartPage';
import { OrderSuccess } from './components/store/OrderSuccess';
import { BlogHome } from './components/store/blog/BlogHome';
import { BlogPostDetail } from './components/store/blog/BlogPostDetail';
import { PageViewer } from './components/store/pages/PageViewer';
import { ContactPage } from './components/store/pages/ContactPage';
import { AIChatAssistant } from './components/store/AIChatAssistant'; 
import { RedirectHandler } from './components/common/RedirectHandler';
import { NotFound } from './components/common/NotFound';
import { Maintenance } from './components/common/Maintenance';

// Customer Auth
import { CustomerLogin } from './components/customer/auth/CustomerLogin';
import { CustomerRegister } from './components/customer/auth/CustomerRegister';
import { CustomerLayout } from './components/customer/CustomerLayout';
import { SettingsProvider, useSettings } from './contexts/SettingsContext'; 
import { Product, CartItem } from './types';
import { ShoppingBag, X } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
      if (activeTab === 'products-add') {
          setShowAddProduct(true);
      }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 flex font-sans text-gray-900 dark:text-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onNavigate={navigate}
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />
      
      <TopHeader 
        sidebarOpen={!sidebarCollapsed} 
        onMobileMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        onAddProduct={() => setActiveTab('products-add')}
        setActiveTab={setActiveTab}
      />

      <div className={`flex-1 transition-all duration-300 p-4 md:p-8 pt-20 min-h-screen overflow-x-hidden
         ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} ml-0`}>
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'reports' && <AdminReports />}
          {activeTab === 'media' && <AdminMedia />}
          {activeTab === 'menus' && <AdminMenus />}
          {activeTab === 'products' && <AdminProducts />}
          {(activeTab === 'products-add' || showAddProduct) && showAddProduct && (
              <ProductEditor onSave={() => { setShowAddProduct(false); setActiveTab('products'); }} onCancel={() => { setShowAddProduct(false); setActiveTab('products'); }} />
          )}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'collections' && <AdminCollections />}
          {activeTab === 'inventory' && <AdminInventory />}
          {activeTab.startsWith('orders') && <AdminOrders />}
          {activeTab === 'customers' && <AdminCustomers />}
          {activeTab === 'coupons' && <AdminCoupons />}
          {activeTab === 'reviews' && <AdminReviews />}
          {activeTab === 'blog' && <AdminBlog />}
          {activeTab === 'pages' && <AdminPages />}
          {activeTab === 'contact' && <AdminContact />}
          {(activeTab.startsWith('settings') || activeTab === 'account') && (
              <AdminSettings initialTab={activeTab === 'account' ? 'system' : activeTab.replace('settings-', '')} />
          )}
        </div>
      </div>
    </div>
  );
};

const StoreLayout: React.FC = () => {
  const { settings } = useSettings(); 
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (settings?.maintenance?.enabled) {
      return <Maintenance message={settings.maintenance.message} />;
  }

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => 
          p.id === product.id && 
          p.selectedVariant?.sku === (product as CartItem).selectedVariant?.sku
      );
      
      if (existing) {
        return prev.map(p => 
            (p.id === product.id && p.selectedVariant?.sku === (product as CartItem).selectedVariant?.sku) 
            ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 } as CartItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, variantSku?: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedVariant?.sku === variantSku)));
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const themeStyle = settings?.theme?.colors?.primary ? `
    :root { 
        --primary-color: ${settings.theme.colors.primary}; 
        --text-color: ${settings.theme.colors.text};
    }
    .text-indigo-600 { color: var(--primary-color) !important; }
    .bg-indigo-600 { background-color: var(--primary-color) !important; }
    .border-indigo-600 { border-color: var(--primary-color) !important; }
    .hover\\:bg-indigo-700:hover { opacity: 0.9; background-color: var(--primary-color) !important; }
  ` : '';

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-gray-900">
      <style>{themeStyle}</style>
      <RedirectHandler />
      
      <AnnouncementBar />
      <Header 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      
      <main className="flex-1">
          <Outlet context={{ addToCart, cart, clearCart, removeFromCart }} />
      </main>

      <Footer />
      
      <AIChatAssistant />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[60] transition-opacity backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-[70] flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <ShoppingBag size={48} className="text-gray-200" />
                    <div className="text-gray-500">Your cart is empty</div>
                    <button onClick={() => { setIsCartOpen(false); navigate('/shop'); }} className="text-indigo-600 font-medium hover:underline">
                        Start Shopping
                    </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${item.selectedVariant?.sku || idx}`} className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        <img src={item.images[0] || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{item.title}</h4>
                      {item.selectedVariant && <p className="text-xs text-gray-500 mt-1">{item.selectedVariant.name}</p>}
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm font-medium">${item.price.toFixed(2)}</div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                            <button 
                            onClick={() => removeFromCart(item.id, item.selectedVariant?.sku)}
                            className="text-xs font-medium text-red-600 hover:text-red-800"
                            >
                            Remove
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-medium text-gray-600">Subtotal</span>
                <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 text-center">Shipping and taxes calculated at checkout.</p>
              
              <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { setIsCartOpen(false); navigate('/cart'); }}
                    className="w-full border border-black text-black py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    View Cart
                  </button>
                  <button 
                    onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                    disabled={cart.length === 0}
                    className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Checkout
                  </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

type StoreContextType = { addToCart: (p: Product) => void, cart: CartItem[], clearCart: () => void, removeFromCart: (id: string, v?: string) => void };
export function useStore() {
  return useOutletContext<StoreContextType>();
}

export default function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StoreLayout />}>
              <Route index element={<StoreHomeWrapper />} />
              <Route path="shop" element={<ShopWrapper />} />
              <Route path="collections" element={<CollectionPageWrapper />} />
              <Route path="products/:slug" element={<ProductDetailsWrapper />} />
              <Route path="product/:id" element={<ProductDetailsWrapper />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success/:id" element={<OrderSuccess />} />
              <Route path="blog" element={<BlogHome />} />
              <Route path="blog/:slug" element={<BlogPostDetail />} />
              <Route path="pages/:slug" element={<PageViewer />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="about" element={<PageViewer />} />
              <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<CustomerRegister />} />
          <Route path="/account/*" element={<CustomerLayout />} />
          
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin/customizer" element={<HomepageCustomizer />} />
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
      </Router>
    </SettingsProvider>
  );
}

const StoreHomeWrapper = () => { const { addToCart } = useStore(); return <StoreHome addToCart={addToCart} />; };
const ShopWrapper = () => { const { addToCart } = useStore(); return <CollectionPage addToCart={addToCart} />; };
const CollectionPageWrapper = () => { const { addToCart } = useStore(); return <CollectionPage addToCart={addToCart} />; };
const ProductDetailsWrapper = () => { const { addToCart } = useStore(); return <ProductDetails addToCart={addToCart} />; };
