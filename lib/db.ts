import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("🔄 Reusing existing MongoDB connection");
        return;
    }

    try {

        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        const dbConnection = await mongoose.connect(dbUri)

        isConnected = true;
        console.log("✅ MongoDB connected");

    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
};

export default connectDB;