import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

let isConnected = false;

export const connectToDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        console.log("Already connected to MongoDB");
        return;
    }
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
        isConnected = true;
        console.log("MongoDB connected successfully ☺");
    } catch (err) {
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB error:", err);
            if (err.name === "MongoNetworkError") {
                console.log("Retrying connection...");
                setTimeout(() => connectToDB(), 5000);
            }
        });

        throw new Error("Error connecting to MongoDB: " + err);
    }
};


