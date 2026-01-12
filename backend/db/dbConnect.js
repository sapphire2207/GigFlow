import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
  if (isConnected) return;

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = connection.connections[0].readyState;
    console.log("MongoDB connected:", connection.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectToDB;
