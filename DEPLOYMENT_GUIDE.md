# 🚀 ShopGenius - Complete Deployment & Troubleshooting Guide

Ye guide aapko ShopGenius platform ko successfully deploy karne aur future mein aane wale maslon (issues) ko hal karne mein madad degi.

---

## 📑 Table of Contents
1. [Masla Kya Tha? (The Issue)](#1-masla-kya-tha)
2. [🚫 Common Failures & Solutions](#2-common-failures--solutions)
3. [📦 Step-by-Step Deployment](#3-step-by-step-deployment)
4. [🔧 Environment Variables Setup](#4-environment-variables-setup)
5. [📝 Next Steps for You](#5-next-steps-for-you)

---

## 1. Masla Kya Tha? (The Issue)

Tumhare project mein do bade masle aa sakte the:

*   **CORS Error (Cross-Origin Resource Sharing):** Jab tumhara Frontend (Vercel) kisi doosre domain (Render Backend) se data mangta hai, toh browser usse security ki wajah se block kar deta hai. 
    *   *Failure:* User login nahi kar pata aur products load nahi hote.
*   **Gemini API Model Update:** AI models purane ho jate hain ya unke endpoints badal jate hain. 
    *   *Failure:* AI features (Description generation) kaam karna band kar dete hain.
*   **White Screen Error:** Backend libraries (Express/Mongoose) ko galti se frontend `index.html` mein include kar lena. 
    *   *Failure:* Browser app load hi nahi karta, sirf white screen dikhti hai.

---

## 2. 🚫 Common Failures & Solutions

| Error | Kyun Aata Hai? | Fix Kaise Karein? |
| :--- | :--- | :--- |
| **500 Internal Error** | .env keys missing hain Render par. | Render Dashboard > Environment check karein. |
| **CORS Blocked** | Backend mein Vercel URL allowed nahi. | `backend/app.js` mein `FRONTEND_URL` update karein. |
| **Build Failed** | Root Directory galat select ki hai. | Backend ke liye `backend` folder hi select karein. |
| **Database Timeout** | IP Whitelist nahi ki. | MongoDB Atlas mein `0.0.0.0/0` (Allow access from anywhere) karein. |
| **White Screen** | Node.js code browser mein load hua. | `index.html` se `express`, `mongoose`, `fs` wagera hata dein. |

---

## 3. 📦 Step-by-Step Deployment

### Backend (Render)
1.  **GitHub Push:** Sabse pehle code push karein: `git add . && git commit -m "Fixes" && git push origin main`.
2.  **New Web Service:** Render dashboard par GitHub connect karein.
3.  **Settings:** 
    *   Root Directory: `backend`
    *   Build Command: `npm install`
    *   Start Command: `node app.js`
4.  **Environment Variables:** Neeche di gayi list add karein.

### Frontend (Vercel)
1.  **Import Project:** GitHub repo select karein.
2.  **Settings:** Framework "Vite" select karein.
3.  **Env Variable:** `VITE_API_URL` ko apne Render URL par set karein (e.g., `https://api.onrender.com/api`).

---

## 4. 🔧 Environment Variables Setup

### Backend (Render par add karein)
```env
MONGO_URI=mongodb+srv://...
API_KEY=AIzaSy... (Gemini Key)
JWT_SECRET=your_secret_32_chars
CLOUDINARY_CLOUD_NAME=...
FRONTEND_URL=https://your-app.vercel.app
```

---

## 5. 📝 Next Steps for You

Ab tum Render ke Dashboard par jao aur "Events" aur "Logs" check karo. Agar wahan **"Live"** ya **"Success"** likha aa raha hai, toh iska matlab tumhara Backend zinda hai!

**Frontend Connection Checklist:**
1.  Render se apna **Backend URL** copy karein.
2.  Apne Frontend ke environment variables mein `VITE_API_URL` update karein.
3.  `services/apiConfig.ts` check karein ke wo environment variable ko pehle priority de raha hai.

**Best Practice:**
Kabhi bhi `.env` file GitHub pe push mat karna. Hamesha `.env.example` rakho taake doosron ko pata chale konsi keys chahiye.

---
**Status:** ✅ Ready for Production
**Last Updated:** January 2025