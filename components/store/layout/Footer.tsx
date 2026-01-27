
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, CreditCard, Mail, MapPin, Phone } from 'lucide-react';
import { useSettings } from '../../../contexts/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const storeName = settings?.general?.storeName || 'ShopGenius';

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tighter font-[Poppins] text-white">{storeName}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We curate the finest products for modern living. Quality, sustainability, and design are at the heart of everything we do.
            </p>
            <div className="flex gap-4">
               {/* Social Icons */}
               <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all"><Facebook size={18}/></a>
               <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all"><Instagram size={18}/></a>
               <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all"><Twitter size={18}/></a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-white mb-6 font-[Poppins] uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="/shop?sort=newest" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="/shop?sort=bestsellers" className="hover:text-white transition-colors">Best Sellers</a></li>
                <li><a href="/collections" className="hover:text-white transition-colors">Collections</a></li>
                <li><a href="/shop?on_sale=true" className="hover:text-white transition-colors">Sale</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-white mb-6 font-[Poppins] uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-white mb-6 font-[Poppins] uppercase tracking-wider text-sm">Get in Touch</h4>
            <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 shrink-0"/> 
                    <span>{settings?.general?.address?.street}, {settings?.general?.address?.city}</span>
                </li>
                <li className="flex items-center gap-3">
                    <Phone size={16} className="shrink-0"/>
                    <span>{settings?.general?.storePhone}</span>
                </li>
                <li className="flex items-center gap-3">
                    <Mail size={16} className="shrink-0"/>
                    <span>{settings?.general?.storeEmail}</span>
                </li>
            </ul>
            <div className="mt-8">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">We Accept</p>
                <div className="flex gap-2 opacity-70 grayscale hover:grayscale-0 transition-all">
                   <div className="h-8 w-12 bg-gray-800 rounded flex items-center justify-center border border-gray-700"><CreditCard size={20}/></div>
                   <div className="h-8 w-12 bg-gray-800 rounded flex items-center justify-center border border-gray-700"><span className="font-bold text-xs italic">VISA</span></div>
                   <div className="h-8 w-12 bg-gray-800 rounded flex items-center justify-center border border-gray-700"><span className="font-bold text-xs">Pay</span></div>
                </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
                &copy; {currentYear} {storeName}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-white">Privacy</a>
                <a href="#" className="hover:text-white">Terms</a>
                <a href="#" className="hover:text-white">Cookies</a>
            </div>
        </div>
      </div>
    </footer>
  );
};
