
// --- Schema Interfaces ---

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'editor';
  addresses: Address[];
  wishlist?: string[] | Product[];
  createdAt?: string;
}

export interface Category {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: Category | string | null;
  productCount?: number;
}

export interface ProductVariant {
  sku: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  image?: string;
}

export interface Product {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  category?: Category | string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  images: string[];
  variants: ProductVariant[];
  hasVariants?: boolean;
  inventory: number; // calculated form variants or direct
  stock?: number; // alias
  sku?: string;
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  isFeatured?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  relatedProducts?: string[] | Product[];
  upsellProducts?: string[] | Product[];
  salesCount?: number;
  viewCount?: number;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface OrderItem {
  product: string | Product;
  productId?: string; // legacy
  productTitle: string;
  variantSku?: string;
  variantName?: string;
  quantity: number;
  price: number;
  image?: string;
  isReviewed?: boolean;
}

export interface Order {
  id: string;
  _id?: string;
  orderNumber: string;
  customerName: string;
  userId?: string;
  user?: User | string;
  guestEmail?: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  paymentFee?: number;
  status: 'pending_payment' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'partially_refunded';
  date?: string;
  createdAt: string;
  shippingAddress?: Address;
  paymentStatus?: string;
  paymentMethod?: string;
  refunds?: { amount: number, reason: string, date: string }[];
  timeline?: { status: string; note: string; date: string }[];
  deliveredAt?: string;
}

export interface Review {
  _id: string;
  product: string | Product;
  user: string | User;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  helpfulCount?: number;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  author?: User | string;
  category?: string | any;
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string;
  tags?: string[];
  createdAt: string;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  template: 'default' | 'full-width' | 'contact' | 'about';
  status: 'published' | 'draft';
  showInNav: boolean;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  recentOrders: Order[];
}

// --- Detailed Settings Interface ---

export interface Slide {
    _id?: string;
    image: string;
    mobileImage?: string;
    tagline?: string;
    heading: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    textPosition?: 'left' | 'center' | 'right';
    overlayOpacity?: number;
}

export interface ShippingZone {
    _id?: string;
    name: string;
    countries: string[];
    rate: number;
}

export interface StoreSettings {
  general: {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    logoUrl?: string;
    faviconUrl?: string;
    currency: string;
    timezone: string;
    address: Address;
  };
  theme: {
    colors: {
        primary: string;
        secondary?: string;
        accent?: string;
        background?: string;
        text?: string;
    };
    typography: {
        fontFamily: string;
        headingFont?: string;
        bodySize?: string;
    };
    layout: {
        headerStyle: string;
        productCardStyle: string;
        productsPerRow: number;
    };
  };
  homepage: {
      announcementBar: {
          enabled: boolean;
          text: string;
          link: string;
          backgroundColor?: string;
          textColor?: string;
      };
      sections: any[];
  };
  social: {
      facebook: string;
      instagram: string;
      twitter: string;
      youtube: string;
      tiktok: string;
      pinterest: string;
  };
  payment: {
    stripe: { enabled: boolean; publicKey?: string; secretKey?: string; testMode: boolean };
    paypal: { enabled: boolean; clientId?: string; clientSecret?: string; testMode: boolean };
    cod: { enabled: boolean; additionalFee: number; maxOrderAmount?: number };
    bankTransfer: { enabled: boolean; bankName?: string; accountName?: string; iban?: string; swift?: string; instructions?: string };
  };
  shipping: {
    freeShippingThreshold: number;
    standardRate: number;
    zones: ShippingZone[];
  };
  tax: {
    enabled: boolean;
    rate: number;
    includeInPrice: boolean;
  };
  checkout: {
      guestCheckout: boolean;
      minOrderAmount: number;
      termsPage: string;
      privacyPage: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    fromName: string;
    fromEmail: string;
  };
  seo: {
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
      googleAnalyticsId: string;
      facebookPixelId: string;
      robotsTxt: string;
      ogImage?: string;
      facebookAppId?: string;
      twitterCard?: string;
  };
  maintenance?: {
      enabled: boolean;
      message: string;
  };
}
