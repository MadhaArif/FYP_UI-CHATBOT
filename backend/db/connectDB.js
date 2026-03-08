import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("🟢 MongoDB already connected");
      return;
    }

    console.log("⏳ Connecting to MongoDB...");

    await mongoose.connect(process.env.DATABASE_CONNECTION_URL, {
      serverSelectionTimeoutMS: 15000, // Wait 15s for connection
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error; // Let the caller handle it
  }
};

export default connectDB;
