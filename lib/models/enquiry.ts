import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: String,
  courseTitle: { type: String, required: true },
  acceptTerms: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

export interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college?: string;
  courseTitle: string;
  acceptTerms: boolean;
  createdAt: Date;
}

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);