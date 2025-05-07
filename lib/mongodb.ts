import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(uri as string); // `uri` is now definitely a string
    isConnected = true;
    console.log('MongoDB connected');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
