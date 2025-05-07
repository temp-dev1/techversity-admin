import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
  id: Number,
  name: String,
  logo: String,
});

export interface Partner {
  _id: string;
  id: number;
  name: string;
  logo: string;
}

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);