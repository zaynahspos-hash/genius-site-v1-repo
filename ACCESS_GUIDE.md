# 📘 ShopGenius: Storefront & Admin Panel Guide

Welcome to your AI-Powered E-commerce platform. This guide explains how to access the public store, manage the backend, and ensure your "Real Data" connection is stable.

---

## 🛒 1. Public Storefront (Customer View)

The storefront is what your customers see. It is highly optimized for speed and conversion.

### **How to Access:**
*   **Production:** `https://genius-site-v1-repo.vercel.app` (or your custom domain)
*   **Development:** `http://localhost:5173`

### **Key Features for Customers:**
1.  **AI Shopping Assistant:** Look for the sparkle icon in the bottom right. Customers can chat with an AI that knows your catalog and can recommend products.
2.  **Dynamic Homepage:** Sections like Hero Banners, Countdown Timers, and Featured Grids are updated in real-time from your Admin settings.
3.  **Advanced Filter & Search:** Customers can find products by category, price range, or instant search.
4.  **Customer Accounts:** Users can sign up to track orders, manage addresses, and save wishlists.
5.  **Checkout:** Supports Stripe (Card), Cash on Delivery (COD), and Bank Transfer.

---

## 🛡️ 2. Admin Dashboard (Merchant View)

The Admin Dashboard is where you manage products, fulfill orders, and configure AI settings.

### **How to Access:**
*   **Direct Link:** Append `/#/admin` to your store URL.
*   **Login Page:** `https://your-site.vercel.app/#/admin/login`
*   **First Time Setup:** If you haven't created an admin yet, go to `/#/admin/register` to create the Super Admin account.

### **Management Modules:**
| Module | Purpose | AI Feature |
| :--- | :--- | :--- |
| **Dashboard** | Overview of sales, orders, and visitors. | **AI Insights:** Click "AI Insights" for business growth strategies. |
| **Products** | Manage your catalog and inventory. | **AI Writer:** Auto-generate SEO-optimized descriptions. |
| **Orders** | Fulfill shipments, process refunds, and add notes. | - |
| **Media** | Cloud-based file manager for images. | - |
| **Online Store** | **Homepage Customizer:** Drag & drop visual editor. | - |
| **Settings** | Configure Payments, Taxes, and SEO. | - |

---

## ⚙️ 3. "Real Data" Connection Setup (Render & Vercel)

To ensure your app talks to your **Real Database (MongoDB)** and not demo data, you must configure these variables.

### **Backend (Render.com Settings)**
Ensure these **Environment Variables** are added in your Render Dashboard:
1.  `MONGO_URI`: Your MongoDB Atlas connection string.
2.  `API_KEY`: Your Google Gemini API Key.
3.  `JWT_SECRET`: A secure random string for login security.
4.  `FRONTEND_URL`: `https://your-app-name.vercel.app` (Stops CORS errors).

### **Frontend (Vercel Settings)**
Ensure this variable is added in your Vercel Project Settings:
1.  `VITE_API_URL`: `https://your-backend-name.onrender.com/api`

---

## 🤖 4. Gemini AI Integration Details

Your app is configured to use the latest high-performance models:
*   **Text Tasks:** `gemini-3-flash-preview` (Fastest for descriptions & chat).
*   **Complex Analysis:** `gemini-3-pro-preview` (Used for dashboard insights).
*   **Image Gen:** `gemini-2.5-flash-image` (Generates product mockups).

---

## 🆘 Troubleshooting Common Issues

*   **"CORS Error":** Make sure the `FRONTEND_URL` in Render matches your Vercel URL exactly.
*   **"Server Busy" Message:** This appears if the backend is sleeping or spinning up. Give it 30 seconds to wake up on Render's free tier.
*   **White Screen:** Check the browser console. Usually means a missing dependency or a backend library accidentally imported in the frontend.

---
**Status:** ✅ Production Ready
**Admin Access:** Secured via JWT Authentication
