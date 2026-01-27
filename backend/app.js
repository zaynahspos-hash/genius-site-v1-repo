
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# --- DATABASE (MongoDB Atlas) ---
# Connection string to your specific 'shopgenius' database
MONGO_URI=mongodb+srv://zaynahspos_db_user:dbJ6ime4PgNyJkzd@cluster0.gqwsjdu.mongodb.net/shopgenius?retryWrites=true&w=majority

# --- SECURITY ---
# A secure string for signing JWT tokens
JWT_SECRET=shopgenius_secret_key_2024_v1
JWT_EXPIRE=30d

# --- GOOGLE GEMINI AI ---
# Used for AI Product Descriptions and Shopping Assistant
API_KEY=AIzaSyDeb07wTYj8eEVDwtEVtsYhyQG_L18FJCU

# --- CLOUDINARY (Media Storage: Project dqhxc4llt) ---
CLOUDINARY_CLOUD_NAME=dqhxc4llt
CLOUDINARY_API_KEY=324246626238232
CLOUDINARY_API_SECRET=92pQkz97sazfb3aJyHxP0jDwKiM
CLOUDINARY_UPLOAD_PRESET=totvogue_unsigned

# --- EMAIL SERVICE (Gmail SMTP) ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=zaynahspos@gmail.com
SMTP_PASS=yezz felk xqzn dbdw
SMTP_FROM_EMAIL=zaynahspos@gmail.com
SMTP_FROM_NAME=ShopGenius
