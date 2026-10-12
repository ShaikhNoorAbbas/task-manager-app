import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.mongodbURI, {
            dbName: "taskmanager"
        });

        console.log("Connected to MongoDB");
    } catch (error) {

        console.log(`MongoDB Connection Fail: ${error}`)
    }
}

export default connectDB;