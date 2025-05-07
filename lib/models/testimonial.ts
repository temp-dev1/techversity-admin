import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  role: String,
  company: String,
  testimonial: String,
  course: String,
});

export interface Testimonial {
  _id: string;
  id: number;
  name: string;
  image: string;
  role: string;
  company: string;
  testimonial: string;
  course: string;
}

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);