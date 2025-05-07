import mongoose from 'mongoose';

const QuerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export interface Query {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

export default mongoose.models.Query || mongoose.model('Query', QuerySchema);