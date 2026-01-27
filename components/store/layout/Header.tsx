
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, User, Heart, X, ChevronDown, Phone, Mail, Instagram, Facebook, Twitter, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { customerService } from '../../../services/customerService';
import { useSettings } from '../../../contexts/SettingsContext';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onOpenSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = customerService.getCurrentUser();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoUrl = settings?.general?.logoUrl;
  const storeName = settings?.general?.storeName || 'ShopGenius';
  const headerStyle = settings?.theme?.layout?.headerStyle || 'classic'; // classic, centered, minimal, mega, transparent
  
  // Logic for Transparent Header (only on Homepage, before scroll)
  const isTransparent = headerStyle === 'transparent' && location.pathname === '/' && !scrolled;
  
  // Text Colors
  const textColor = isTransparent ? 'text-white' : 'text-gray-900';
  const iconColor = isTransparent ? 'text-white hover:bg-white/20' : 'text-gray-600 hover:bg-black/5 hover:text-black';
  const navLinkClass = `text-sm font-medium transition-colors ${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-indigo-600'}`;

  // Background Styles
  const bgClass = isTransparent 
    ? 'bg-transparent border-transparent' 
    : 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm';

  // --- Components ---

  const Logo = () => (
    <Link to="/" className={`text-2xl font-bold tracking-tighter flex items-center gap-2 font-[Poppins] ${textColor}`}>
        {logoUrl ? <img src={logoUrl} alt={storeName} className="h-8 w-auto object-contain" /> : storeName}
    </Link>
  );

  const NavLinks = () => (
    <>
        <Link to="/" className={navLinkClass}>Home</Link>
        <Link to="/shop" className={navLinkClass}>Shop</Link>
        <Link to="/collections" className={navLinkClass}>Collections</Link>
        <Link to="/blog" className={navLinkClass}>Journal</Link>
        <Link to="/about" className={navLinkClass}>About</Link>
        <Link to="/contact" className={navLinkClass}>Contact</Link>
    </>
  );

  const Icons = () => (
    <div className="flex items-center gap-1 sm:gap-2">
        {/* Temporary Admin Link */}
        <Link 
            to="/admin" 
            className={`hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all mr-2 ${
                isTransparent 
                ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:text-gray-900'
            }`}
        >
            <LayoutDashboard size={14} />
            Admin View
        </Link>

        <button onClick={onOpenSearch} className={`p-2 rounded-full transition-colors ${iconColor}`}>
            <Search size={20} />
        </button>
        <Link to={user ? "/account" : "/login"} className={`p-2 rounded-full transition-colors ${iconColor} hidden sm:block`}>
            <User size={20} />
        </Link>
        <Link to="/account/wishlist" className={`p-2 rounded-full transition-colors ${iconColor} hidden sm:block`}>
            <Heart size={20} />
        </Link>
        <button onClick={onOpenCart} className={`p-2 rounded-full relative group transition-colors ${iconColor}`}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-indigo-600 rounded-full shadow-sm animate-in zoom-in">
                    {cartCount}
                </span>
            )}
        </button>
        <button onClick={() => setMobileMenuOpen(true)} className={`p-2 rounded-full lg:hidden ${iconColor}`}>
            <Menu size={24} />
        </button>
    </div>
  );

  // --- RENDER MEGA HEADER (Distinct Structure) ---
  if (headerStyle === 'mega') {
      return (
        <>
            {/* Top Bar */}
            <div className="bg-gray-900 text-white text-xs py-2 px-4 hidden md:flex justify-between items-center transition-all">
                <div className="flex gap-4">
                    <span className="flex items-center gap-2"><Phone size={12}/> {settings?.general?.storePhone}</span>
                    <span className="flex items-center gap-2"><Mail size={12}/> {settings?.general?.storeEmail}</span>
                </div>
                <div className="flex gap-4 items-center">
                    <Link to="/account" className="hover:text-gray-300">My Account</Link>
                    <span className="text-gray-600">|</span>
                    <div className="flex gap-3">
                        <Facebook size={14} className="cursor-pointer hover:text-blue-400"/>
                        <Instagram size={14} className="cursor-pointer hover:text-pink-400"/>
                        <Twitter size={14} className="cursor-pointer hover:text-sky-400"/>
                    </div>
                </div>
            </div>
            
            {/* Main Header */}
            <header className={`sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
                    <div className="shrink-0"><Logo /></div>
                    
                    {/* Search Bar (Mega specific) */}
                    <div className="flex-1 max-w-xl relative hidden md:block">
                        <input 
                            onClick={onOpenSearch}
                            readOnly
                            placeholder="Search for products, brands and more..." 
                            className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-5 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 cursor-text hover:bg-gray-200 transition-colors"
                        />
                        <div className="absolute right-1 top-1 p-1.5 bg-indigo-600 rounded-full text-white pointer-events-none">
                            <Search size={16} />
                        </div>
                    </div>

                    <div className="shrink-0"><Icons /></div>
                </div>
                
                {/* Navigation Bar (Mega specific) */}
                <div className="border-t border-gray-100 hidden lg:block">
                    <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-center gap-8">
                        <NavLinks />
                    </div>
                </div>
            </header>
            
            {/* Mobile Menu (Common) */}
            <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} storeName={storeName} />
        </>
      );
  }

  // --- RENDER OTHER STYLES ---
  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${bgClass} ${headerStyle === 'transparent' ? 'absolute' : 'fixed'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          <div className="flex justify-between items-center h-full">
            
            {/* 1. CLASSIC Layout (Logo Left, Nav Center, Icons Right) */}
            {(headerStyle === 'classic' || headerStyle === 'transparent') && (
                <>
                    <div className="flex-shrink-0 flex items-center"><Logo /></div>
                    <nav className="hidden lg:flex items-center gap-8 justify-center flex-1"><NavLinks /></nav>
                    <div className="flex-shrink-0"><Icons /></div>
                </>
            )}

            {/* 2. CENTERED Layout (Nav Left, Logo Center, Icons Right) */}
            {headerStyle === 'centered' && (
                <>
                    <nav className="hidden lg:flex items-center gap-6 flex-1"><NavLinks /></nav>
                    <div className="absolute left-1/2 -translate-x-1/2 flex justify-center"><Logo /></div>
                    <div className="flex-1 flex justify-end"><Icons /></div>
                    
                    {/* Mobile fix for centered: Logo Left, Icons Right */}
                    <div className="lg:hidden flex items-center mr-auto"><Logo /></div>
                </>
            )}

            {/* 3. MINIMAL Layout (Logo Left, Menu Right - No visible nav links) */}
            {headerStyle === 'minimal' && (
                <>
                    <div className="flex items-center"><Logo /></div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex"><Icons /></div>
                        {/* Hamburger always visible on desktop for minimal */}
                        <button onClick={() => setMobileMenuOpen(true)} className={`p-2 hidden lg:block ${iconColor}`}>
                            <Menu size={24} />
                        </button>
                        {/* Mobile Icons */}
                        <div className="lg:hidden"><Icons /></div> 
                    </div>
                </>
            )}

          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} storeName={storeName} />
    </>
  );
};

const MobileMenu = ({ open, onClose, storeName }: { open: boolean, onClose: () => void, storeName: string }) => {
    const user = customerService.getCurrentUser();
    
    return (
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <div className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                  <span className="text-xl font-bold font-[Poppins] text-gray-900">{storeName}</span>
                  <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                  <nav className="flex flex-col space-y-1">
                      {[
                          { l: 'Home', p: '/' }, 
                          { l: 'Shop', p: '/shop' }, 
                          { l: 'Collections', p: '/collections' },
                          { l: 'Journal', p: '/blog' },
                          { l: 'About', p: '/about' },
                          { l: 'Contact', p: '/contact' }
                      ].map((item, idx) => (
                          <Link 
                            key={idx} 
                            to={item.p} 
                            className="px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors flex justify-between items-center group border-b border-gray-50"
                            onClick={onClose}
                          >
                              {item.l}
                              <ChevronDown size={16} className="-rotate-90 text-gray-400 group-hover:text-indigo-600" />
                          </Link>
                      ))}
                  </nav>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                  {/* Temporary Admin Link Mobile */}
                  <Link 
                    to="/admin" 
                    onClick={onClose} 
                    className="flex items-center justify-center gap-2 w-full py-3 mb-4 bg-white border border-gray-200 text-gray-800 rounded-xl font-bold shadow-sm hover:bg-gray-50"
                  >
                      <LayoutDashboard size={16} /> Switch to Admin View
                  </Link>

                  {user ? (
                      <Link to="/account" onClick={onClose} className="flex items-center gap-3 text-gray-900 font-bold mb-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">{user.name[0]}</div>
                          <div>
                              <div className="text-sm">Welcome back,</div>
                              <div>{user.name}</div>
                          </div>
                      </Link>
                  ) : (
                      <Link to="/login" onClick={onClose} className="flex items-center justify-center w-full py-3 bg-black text-white rounded-xl font-bold mb-4 shadow-lg">
                          Sign In
                      </Link>
                  )}
                  <div className="flex justify-center gap-6 text-gray-400 mt-4">
                      <Facebook size={20} className="hover:text-blue-600 cursor-pointer"/>
                      <Instagram size={20} className="hover:text-pink-600 cursor-pointer"/>
                      <Twitter size={20} className="hover:text-sky-500 cursor-pointer"/>
                  </div>
              </div>
          </div>
      </div>
    );
};
