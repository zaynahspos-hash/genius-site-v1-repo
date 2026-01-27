
import { Product, Order, DashboardStats, Category, StoreSettings, User } from '../types';

// --- Mock Data Seeds ---

const INITIAL_USERS: User[] = [
  {
    id: 'admin_1',
    name: 'Demo Admin',
    email: 'admin@shopgenius.com',
    role: 'admin',
    addresses: []
  }
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Electronics', slug: 'electronics', description: 'Gadgets and gear' },
  { id: 'cat_2', name: 'Apparel', slug: 'apparel', description: 'Clothing and fashion' },
  { id: 'cat_3', name: 'Accessories', slug: 'accessories', description: 'Watches, bags, and more' },
  { id: 'cat_4', name: 'Living', slug: 'living', description: 'Home office essentials' }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Luxe Chronograph Watch',
    slug: 'luxe-chronograph-watch',
    description: 'A sleek, modern timepiece designed for the urban professional. Features a genuine leather strap and sapphire crystal glass.',
    categoryId: 'cat_3',
    categoryName: 'Accessories',
    price: 299.00,
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop'],
    variants: [],
    inventory: 45,
    tags: ['luxury', 'men', 'watch'],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Sony WH-1000XM5 Headphones',
    slug: 'premium-headphones',
    description: 'Immerse yourself in pure sound with our top-tier active noise canceling technology. 30-hour battery life.',
    categoryId: 'cat_1',
    categoryName: 'Electronics',
    price: 349.50,
    comparePrice: 399.00,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop'],
    variants: [],
    inventory: 12,
    tags: ['audio', 'wireless', 'tech'],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Organic Cotton Oversized Tee',
    slug: 'organic-cotton-tee',
    description: 'Ethically sourced, 100% organic cotton t-shirt. Breathable, durable, and incredibly soft.',
    categoryId: 'cat_2',
    categoryName: 'Apparel',
    price: 45.00,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop'],
    variants: [
      { sku: 'TSHIRT-S', name: 'Small', price: 45.00, stock: 30, attributes: { size: 'S' } },
      { sku: 'TSHIRT-M', name: 'Medium', price: 45.00, stock: 40, attributes: { size: 'M' } },
      { sku: 'TSHIRT-L', name: 'Large', price: 45.00, stock: 30, attributes: { size: 'L' } }
    ],
    inventory: 100,
    tags: ['clothing', 'sustainable', 'basics'],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Mid-Century Armchair',
    slug: 'mid-century-armchair',
    description: 'Designed for comfort during long work sessions. Adjustable lumbar support and breathable mesh back.',
    categoryId: 'cat_4',
    categoryName: 'Living',
    price: 499.00,
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1000&auto=format&fit=crop'],
    variants: [],
    inventory: 8,
    tags: ['office', 'furniture', 'work'],
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    orderNumber: '1001',
    customerName: 'Alex Johnson',
    total: 299.00,
    subtotal: 299.00,
    discount: 0,
    shippingFee: 0,
    status: 'delivered',
    paymentMethod: 'card',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
        { product: '1', productTitle: 'Luxe Chronograph Watch', quantity: 1, price: 299.00 }
    ]
  }
];

const INITIAL_SETTINGS: StoreSettings = {
  general: {
    storeName: 'ShopGenius',
    storeEmail: 'contact@shopgenius.com',
    storePhone: '+1 (555) 019-2834',
    currency: 'USD',
    timezone: 'UTC',
    address: {
        street: '450 Lexington Ave',
        city: 'New York',
        state: 'NY',
        zip: '10017',
        country: 'US'
    }
  },
  payment: {
    stripe: { enabled: true, testMode: true, publicKey: '', secretKey: '' },
    paypal: { enabled: true, testMode: true },
    cod: { enabled: true, additionalFee: 0, maxOrderAmount: 1000 },
    bankTransfer: { enabled: false }
  },
  shipping: {
    freeShippingThreshold: 100,
    standardRate: 12.00,
    zones: []
  },
  tax: {
    enabled: true,
    rate: 0.08,
    includeInPrice: false
  },
  theme: {
    colors: {
        primary: '#4f46e5',
        secondary: '#f8fafc',
        accent: '#3b82f6',
        background: '#ffffff',
        text: '#1e293b'
    },
    typography: {
        fontFamily: 'Inter',
        headingFont: 'Poppins',
        bodySize: '16px'
    },
    layout: {
        headerStyle: 'mega',
        productCardStyle: 'full',
        productsPerRow: 4
    }
  },
  homepage: {
      announcementBar: {
          enabled: true,
          text: '🎉 Grand Opening Sale: Use code WELCOME20 for 20% off!',
          link: '/shop',
          backgroundColor: '#000000',
          textColor: '#ffffff'
      },
      sections: [
          {
              id: 'hero_1',
              type: 'hero',
              enabled: true,
              order: 0,
              settings: {
                  height: 'full',
                  autoplay: true,
                  autoplaySpeed: 5,
                  slides: [
                      {
                          image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
                          heading: 'New Season Arrivals',
                          description: 'Discover the latest trends in sustainable fashion and modern aesthetics.',
                          buttonText: 'Shop Collection',
                          buttonLink: '/shop',
                          textPosition: 'left',
                          overlayOpacity: 30
                      }
                  ]
              }
          },
          {
              id: 'products_1',
              type: 'products',
              enabled: true,
              order: 1,
              settings: {
                  title: 'Trending Now',
                  subtitle: 'Our most popular products this week',
                  source: 'featured',
                  limit: 8,
                  columns: 4,
                  viewAllLink: '/shop'
              }
          }
      ]
  },
  social: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      youtube: '',
      tiktok: '',
      pinterest: ''
  },
  checkout: {
      guestCheckout: true,
      minOrderAmount: 0,
      termsPage: '/pages/terms',
      privacyPage: '/pages/privacy'
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    fromName: 'ShopGenius',
    fromEmail: 'noreply@shopgenius.com'
  },
  seo: {
      metaTitle: 'ShopGenius - Premium E-commerce',
      metaDescription: 'Shop the best electronics, fashion, and home goods.',
      keywords: ['shop', 'ecommerce', 'premium', 'best deals'],
      googleAnalyticsId: '',
      facebookPixelId: '',
      robotsTxt: 'User-agent: *\nAllow: /'
  }
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

// --- Mock DB Service ---

export const db = {
  getProducts: (): Product[] => load('products', INITIAL_PRODUCTS),
  
  saveProduct: (product: Product) => {
    const products = db.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
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
    save('products', db.getProducts());
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
  
  saveSettings: (settings: StoreSettings) => {
      save('mockSettings', settings);
  },

  getUsers: (): User[] => load('users', INITIAL_USERS),
  
  saveUser: (user: User) => {
    const users = db.getUsers();
    users.push(user);
    save('users', users);
  }
};
