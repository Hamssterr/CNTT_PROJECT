import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {dbName: "CNTT_PROJECT"});
        console.log(`MongooseDB is connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongooseDB connect error: " + error);
    }
}