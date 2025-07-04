import mongoose from "mongoose";

export const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        console.log("Already connected to MongoDB.");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, { 
            serverSelectionTimeoutMS: 30000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB: " + error.message);
    }
};
