import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('⚠️ MONGO_URI is missing in environment variables.');
      return;
    }
    
    // StrictQuery is often recommended to be set
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    // We do NOT exit the process here so the server can still respond to /health checks
    // process.exit(1); 
  }
};

export default connectDB;