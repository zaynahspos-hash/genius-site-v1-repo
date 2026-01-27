
# 🚀 ShopGenius - AI-Powered Enterprise E-commerce

**ShopGenius** is a full-stack, production-ready e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It features a sophisticated Admin Dashboard with Gemini AI integration for content generation, a visual homepage customizer, and a highly optimized storefront.

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [🔐 Secrets & API Guide (Important)](#-secrets--api-guide-important)
    - [Where to put credentials](#1-where-to-put-credentials)
    - [How to get the keys](#2-how-to-get-the-keys)
    - [Codebase Reference Map](#3-codebase-reference-map)
4. [Installation & Local Run](#-installation--local-run)
5. [User Guide: Accessing the App](#-user-guide-accessing-the-app)
6. [Admin Panel Walkthrough](#-admin-panel-walkthrough)
7. [Deployment Guide](#-deployment-guide)

---

## ✨ Features

### 🛒 Storefront
*   **Dynamic Homepage:** Fully customizable sections (Hero, Featured, Video, Countdown, etc.) via Admin.
*   **Advanced Filtering:** Filter by Category, Price, and Sort by various metrics.
*   **Smart Search:** Real-time product search with debouncing.
*   **Cart & Checkout:** Persistent cart, discount coupons, gift cards, and multi-step checkout.
*   **User Dashboard:** Order history, address book management, and wishlist.

### 🛡️ Admin Dashboard
*   **AI Content Generation:** Use **Google Gemini AI** to write product descriptions automatically.
*   **Visual Customizer:** Drag-and-drop / toggle sections for the storefront homepage.
*   **Analytics:** Real-time charts for Sales, Orders, and Inventory using Recharts.
*   **Media Manager:** Full-featured file manager uploading to Cloudinary.
*   **Role-Based Access:** Secure authentication with JWT.

---

## 🔐 Secrets & API Guide (Important)

This application relies on external services for Database, AI, Image Hosting, and Email. Follow this guide to configure them.

### 1. Where to put credentials
Create a file named `.env` in the **root directory** of the project.
*   **Do not** commit this file to Git.
*   Copy the content below and fill in your specific keys.

```env
# --- SERVER CONFIGURATION ---
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# --- DATABASE (MongoDB) ---
# Connection string to your data cluster
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shopgenius?retryWrites=true&w=majority

# --- SECURITY ---
# A long random string used to encrypt user sessions
JWT_SECRET=super_secret_random_string_at_least_32_chars_long

# --- GOOGLE GEMINI AI ---
# Used for generating product descriptions in Admin Panel
API_KEY=your_google_gemini_api_key

# --- CLOUDINARY (Image Uploads) ---
# Used for storing product images and banners
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# --- EMAIL SERVICE (SMTP) ---
# Used for Order Confirmations and Forgot Password emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=ShopGenius
```

---

### 2. How to get the keys

#### 🍃 MongoDB URI
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  Click **"Connect"** > **"Drivers"**.
4.  Copy the connection string. Replace `<password>` with your database user password.

#### 🤖 Google Gemini API Key
1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Click **"Get API key"**.
3.  Click **"Create API key in new project"**.
4.  Copy the key string starting with `AIza...`.

#### ☁️ Cloudinary
1.  Sign up at [Cloudinary](https://cloudinary.com/).
2.  Go to the **Dashboard**.
3.  You will see "Product Environment Credentials".
4.  Copy **Cloud Name**, **API Key**, and **API Secret**.

#### 📧 SMTP (Gmail Example)
1.  Go to your Google Account > Security.
2.  Enable **2-Step Verification**.
3.  Search for **"App Passwords"**.
4.  Create a new app password (name it "ShopGenius").
5.  Use your Gmail address as `SMTP_USER` and the 16-character app password as `SMTP_PASS`.

---

### 3. Codebase Reference Map

Where are these keys actually used in the code?

| Feature | Env Variable | File Location | Logic Description |
| :--- | :--- | :--- | :--- |
| **Database** | `MONGO_URI` | `backend/config/db.js` | Connects Mongoose to your Atlas cluster. |
| **Auth** | `JWT_SECRET` | `backend/controllers/authController.js` | Signs and verifies JSON Web Tokens for login. |
| **AI Gen** | `API_KEY` | `services/geminiService.ts` | Authenticates requests to Google's Generative AI. |
| **Images** | `CLOUDINARY_*` | `backend/config/cloudinary.js` | Configures the SDK to upload images to your bucket. |
| **Emails** | `SMTP_*` | `backend/utils/emailService.js` | Configures Nodemailer transport to send emails. |

---

## 💻 Installation & Local Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Seed Database (Optional)**
    Populates the database with sample products and categories.
    ```bash
    npm run seed
    ```

3.  **Start Development Server**
    Runs backend (Port 5000) and frontend (Vite) concurrently.
    ```bash
    npm run dev
    ```

4.  **Access the App**
    *   Frontend: `http://localhost:5173`
    *   Backend API: `http://localhost:5000`

---

## 📖 User Guide: Accessing the App

### Storefront
*   **URL:** `/` (e.g., `http://localhost:5173/`)
*   Browse products, add to cart, and checkout as a guest or registered user.

### Admin Panel & Credentials
*   **URL:** `/admin` or `/admin/login` (e.g., `http://localhost:5173/#/admin/login`)
*   **First Time Access:**
    1.  Navigate to `/admin/register`.
    2.  Create your Super Admin account.
    3.  Enter your Store Name (this configures the global settings).
*   **Login:** Use the email/password you just created.

---

## 🚀 Deployment Guide

### Option 1: Docker Deployment (Recommended)

1.  **Update `.env` for Docker:**
    Change `MONGO_URI` to use the internal container name if using local mongo, or keep external URI.
    ```env
    MONGO_URI=mongodb://mongo:27017/shopgenius
    ```
2.  **Build and Run:**
    ```bash
    docker-compose up --build -d
    ```
3.  **Access:**
    The app will be available on Port **80** (standard HTTP).

### Option 2: Manual Deployment (Linux/VPS)

1.  **Build Frontend:**
    ```bash
    npm run build
    ```
2.  **Start Backend:**
    ```bash
    npm start
    ```
    (Ensure `.env` is present on the server).

---

## 📜 License

Distributed under the MIT License.
