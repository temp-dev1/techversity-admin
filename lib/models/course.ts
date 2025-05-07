import mongoose from 'mongoose';

const ProgramFeatureSchema = new mongoose.Schema({
  name: String,
  included: Boolean
}, { _id: false });

const ProgramFeeSchema = new mongoose.Schema({
  type: String,
  price: Number,
  features: [ProgramFeatureSchema]
}, { _id: false });

const MentorSchema = new mongoose.Schema({
  name: String,
  image: String,
  role: String,
  company: String,
  companyLogo: String,
  description: String
}, { _id: false });

const CourseSchema = new mongoose.Schema({
  id: Number,
  title: String,
  image: String,
  rating: Number,
  reviews: Number,
  duration: String,
  level: String,
  price: Number,
  discountedPrice: Number,
  nextBatch: String,
  category: String,
  features: [String],
  description: String,
  learningOutcomes: [String],
  careerOpportunities: [String],
  targetAudience: [String],
  mentors: [MentorSchema],
  programFees: [ProgramFeeSchema]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export interface Course {
  _id: string;
  id: number;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  duration: string;
  level: string;
  price: number;
  discountedPrice: number;
  nextBatch: string;
  category: string;
  features: string[];
  description: string;
  learningOutcomes: string[];
  careerOpportunities: string[];
  targetAudience: string[];
  mentors: {
    name: string;
    image: string;
    role: string;
    company: string;
    companyLogo: string;
    description: string;
  }[];
  programFees: {
    type: string;
    price: number;
    features: {
      name: string;
      included: boolean;
    }[];
  }[];
}

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);