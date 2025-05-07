import mongoose from 'mongoose';

const ExpertSchema = new mongoose.Schema({
  id: Number,
  name: String,
  role: String,
  company: String,
  companyLogo: String,
  image: String,
  experience: String,
  linkedin: String,
});

export interface Expert {
  _id: string;
  id: number;
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  image: string;
  experience: string;
  linkedin: string;
}

export default mongoose.models.Expert || mongoose.model('Expert', ExpertSchema);