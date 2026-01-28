import mongoose from 'mongoose';

const settingSchema = mongoose.Schema({
  general: {
    storeName: { type: String, default: 'ShopGenius' },
    storeEmail: String,
    storePhone: String,
    currency: { type: String, default: 'USD' },
    address: { street: String, city: String, state: String, zip: String, country: String },
    logoUrl: String,
    timezone: String
  },
  theme: {
    colors: { primary: String, secondary: String },
    layout: { productsPerRow: Number, headerStyle: String },
    typography: { headingFont: String }
  },
  homepage: {
    sections: [] // Store complex JSON structure for homepage builder
  },
  payment: {
    stripe: { enabled: Boolean, publicKey: String, secretKey: String, testMode: Boolean },
    cod: { enabled: Boolean, additionalFee: Number },
    bankTransfer: { enabled: Boolean, bankName: String, accountName: String, iban: String, instructions: String }
  },
  shipping: {
    standardRate: Number,
    freeShippingThreshold: Number
  },
  email: {
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPass: String,
    fromName: String,
    fromEmail: String
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  maintenance: {
    enabled: { type: Boolean, default: false },
    message: String
  }
}, {
  timestamps: true
});

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;