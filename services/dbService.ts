import { Product, Order, DashboardStats, Category, StoreSettings, User } from '../types';

// --- CLEAN SEED DATA (REMOVED DEMO ITEMS) ---

const INITIAL_USERS: User[] = [];
const INITIAL_CATEGORIES: Category[] = [];
const INITIAL_PRODUCTS: Product[] = [];
const INITIAL_ORDERS: Order[] = [];

const INITIAL_SETTINGS: StoreSettings = {
  general: {
    storeName: 'ShopGenius',
    storeEmail: 'contact@shopgenius.com',
    storePhone: '+1 (555) 019-2834',
    currency: 'USD',
    timezone: 'UTC',
    address: { street: '', city: '', state: '', zip: '', country: 'US' }
  },
  payment: {
    stripe: { enabled: false, testMode: true, publicKey: '', secretKey: '' },
    paypal: { enabled: false, testMode: true },
    cod: { enabled: true, additionalFee: 0 },
    bankTransfer: { enabled: false }
  },
  shipping: { freeShippingThreshold: 100, standardRate: 10, zones: [] },
  tax: { enabled: false, rate: 0, includeInPrice: false },
  theme: {
    colors: { primary: '#4f46e5', secondary: '#f8fafc', accent: '#3b82f6', background: '#ffffff', text: '#1e293b' },
    typography: { fontFamily: 'Inter', headingFont: 'Poppins', bodySize: '16px' },
    layout: { headerStyle: 'classic', productCardStyle: 'minimal', productsPerRow: 4 }
  },
  homepage: {
      announcementBar: { enabled: false, text: '', link: '' },
      sections: []
  },
  social: { facebook: '', instagram: '', twitter: '', youtube: '', tiktok: '', pinterest: '' },
  checkout: { guestCheckout: true, minOrderAmount: 0, termsPage: '', privacyPage: '' },
  email: { smtpHost: '', smtpPort: 587, smtpUser: '', smtpPass: '', fromName: 'ShopGenius', fromEmail: '' },
  seo: { metaTitle: 'ShopGenius', metaDescription: '', keywords: [], googleAnalyticsId: '', facebookPixelId: '', robotsTxt: '' }
};

// --- Local Storage Helpers ---

const load = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) return initial;
  try {
    return JSON.parse(stored);
  } catch {
    return initial;
  }
};

const save = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Mock DB Service (Now acts only as a local cache/fallback) ---

export const db = {
  getProducts: (): Product[] => load('products', INITIAL_PRODUCTS),
  
  saveProduct: (product: Product) => {
    const products = db.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) products[index] = product;
    else products.unshift(product);
    save('products', products);
  },

  deleteProduct: (id: string) => {
    const products = db.getProducts().filter(p => p.id !== id);
    save('products', products);
  },

  getCategories: (): Category[] => load('categories', INITIAL_CATEGORIES),

  getOrders: (): Order[] => load('orders', INITIAL_ORDERS),
  
  createOrder: (order: Order) => {
    const orders = db.getOrders();
    orders.unshift(order);
    save('orders', orders);
  },

  getStats: (): DashboardStats => {
    const orders = db.getOrders();
    const products = db.getProducts();
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
    
    return {
      totalSales,
      totalOrders: orders.length,
      totalProducts: products.length,
      recentOrders: orders.slice(0, 5)
    };
  },

  getSettings: (): StoreSettings => load('mockSettings', INITIAL_SETTINGS),
  
  saveSettings: (settings: StoreSettings) => save('mockSettings', settings),

  getUsers: (): User[] => load('users', INITIAL_USERS),
  
  saveUser: (user: User) => {
    const users = db.getUsers();
    users.push(user);
    save('users', users);
  }
};