import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("🟢 MongoDB already connected");
      return;
    }

    const dbUri = process.env.DATABASE_CONNECTION_URL || process.env.MONGODB_URI;

    if (!dbUri) {
      console.error("❌ ERROR: MongoDB Connection URL (DATABASE_CONNECTION_URL or MONGODB_URI) is missing in process.env");
      throw new Error("MongoDB URI is undefined");
    }

    console.log("⏳ Connecting to MongoDB...");

    await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 15000, // Wait 15s for connection
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error; // Let the caller handle it
  }
};

export default connectDB;
