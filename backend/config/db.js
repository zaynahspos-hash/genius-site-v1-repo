
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // MONGO_URI comes from your Render Environment Variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    // Exit process with failure if DB connection fails
    process.exit(1);
  }
};

export default connectDB;
