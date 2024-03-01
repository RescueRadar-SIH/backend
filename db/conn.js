import mongoose from 'mongoose'
import dotenv from "dotenv";

dotenv.config();

const dbURL = process.env.DB_URL;

// MongoDB Connection
export async function connectDB() {
  try {
    const uri = dbURL;
    await mongoose.connect(uri);
    console.log("Database connected");
  } catch (err) {
    console.log("Error connecting to DB: " + err);
  }
}
